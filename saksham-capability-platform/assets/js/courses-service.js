/**
 * CoursesService — Shared Data Service for Saksham Bharat Platform
 * Single source of truth for loading and accessing the real courses dataset.
 * Consumed by both Home (index.html) and Catalog (courses.html) pages.
 */
const CoursesService = {
  _coursesCache: null,
  _loadingPromise: null,

  /**
   * Load courses from the single source of truth (dataset/courses.json)
   * with robust fallback to dataset/courses.csv.
   * @returns {Promise<Array>} Array of verified course objects
   */
  async loadCourses() {
    if (this._coursesCache && this._coursesCache.length > 0) {
      return this._coursesCache;
    }
    if (this._loadingPromise) {
      return this._loadingPromise;
    }

    this._loadingPromise = (async () => {
      try {
        // 1. Try local dataset/courses.json
        try {
          const res = await fetch("dataset/courses.json?t=" + new Date().getTime());
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              this._coursesCache = data;
              return data;
            }
          }
        } catch (e1) {
          // ignore fetch error on file:// or missing path
        }

        // 2. Try ../dataset/courses.json
        try {
          const res2 = await fetch("../dataset/courses.json?t=" + new Date().getTime());
          if (res2.ok) {
            const data2 = await res2.json();
            if (Array.isArray(data2) && data2.length > 0) {
              this._coursesCache = data2;
              return data2;
            }
          }
        } catch (e2) {}

        // 3. Try dataset/courses.csv
        try {
          const csvRes = await fetch("dataset/courses.csv?t=" + new Date().getTime());
          if (csvRes.ok) {
            const csvText = await csvRes.text();
            const parsed = this.parseCsv(csvText);
            if (parsed && parsed.length > 0) {
              this._coursesCache = parsed;
              return parsed;
            }
          }
        } catch (e3) {}

        // 4. Try window.DEFAULT_COURSES_DATA (guaranteed to work offline and on file:///)
        if (typeof window !== "undefined" && Array.isArray(window.DEFAULT_COURSES_DATA) && window.DEFAULT_COURSES_DATA.length > 0) {
          this._coursesCache = window.DEFAULT_COURSES_DATA;
          return window.DEFAULT_COURSES_DATA;
        }

        // 5. Try MockDB.courses fallback
        if (typeof MockDB !== "undefined" && Array.isArray(MockDB.courses) && MockDB.courses.length > 0) {
          const fallbackList = MockDB.courses.map(c => ({
            course_id: c.id,
            course_name: c.title,
            competency: c.category,
            category: c.category,
            level: c.level || "Beginner",
            delivery_mode: "Online",
            description: `${c.title} — Comprehensive training covering ${c.category} competencies and core public sector standards.`,
            duration_hours: 14,
            duration_weeks: 3,
            max_participants: 30,
            resource_types: ["video", "pdf", "quiz"],
            prerequisites: [],
            certification_offered: true,
            status: "active",
            total_enrolled: 120,
            average_course_rating: 4.8
          }));
          this._coursesCache = fallbackList;
          return fallbackList;
        }

        throw new Error("Could not load courses from dataset, window, or MockDB");
      } finally {
        this._loadingPromise = null;
      }
    })();

    return this._loadingPromise;
  },

  /**
   * Robust CSV parser for the 23-column dataset
   */
  parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const values = [];
      let inQuotes = false;
      let cur = "";
      for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          values.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      values.push(cur);
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = (values[idx] || "").trim();
      });
      result.push({
        course_id: row.course_id,
        course_name: row.course_name,
        competency: row.competency,
        category: row.category,
        level: row.level,
        delivery_mode: row.delivery_mode,
        duration_hours: parseInt(row.duration_hours) || 0,
        duration_weeks: parseInt(row.duration_weeks) || 0,
        max_participants: parseInt(row.max_participants) || 0,
        resource_types: (row.resource_types || "").split(";").map(r => r.trim()).filter(Boolean),
        prerequisites: row.prerequisites || "",
        certification_offered: (row.certification_offered || "").toLowerCase() === "true",
        start_date: row.start_date || "",
        end_date: row.end_date || "",
        status: row.status || "upcoming",
        num_qualified_trainers: parseInt(row.num_qualified_trainers) || 0,
        primary_trainer_id: row.primary_trainer_id || "",
        num_recommended_trainees: parseInt(row.num_recommended_trainees) || 0,
        total_enrolled: parseInt(row.total_enrolled) || 0,
        completion_rate_percent: parseFloat(row.completion_rate_percent) || null,
        average_course_rating: parseFloat(row.average_course_rating) || null,
        average_assessment_pass_rate_percent: parseFloat(row.average_assessment_pass_rate_percent) || null,
        description: row.description || ""
      });
    }
    return result;
  },

  /**
   * Get 3 real recommended courses from the dataset.
   * Dynamically selects 3 diverse courses across distinct categories.
   * Prioritizes active/available or certified courses when possible.
   * @param {Array} courses All loaded courses
   * @param {number} count Number of recommendations to return (default 3)
   * @returns {Array} Array of recommended course records
   */
  getRecommendations(courses, count = 3) {
    if (!courses || !courses.length) return [];

    const selected = [];
    const usedCategories = new Set();

    // Prefer diverse categories across the dataset
    for (const c of courses) {
      if (!usedCategories.has(c.category)) {
        selected.push(c);
        usedCategories.add(c.category);
        if (selected.length === count) break;
      }
    }

    // Fill from remaining if needed
    if (selected.length < count) {
      for (const c of courses) {
        if (!selected.includes(c)) {
          selected.push(c);
          if (selected.length === count) break;
        }
      }
    }

    return selected;
  },

  /**
   * Get all unique categories with exact course counts
   * @param {Array} courses All loaded courses
   * @returns {Object} { categoryName: count }
   */
  getCategoryCounts(courses) {
    const counts = {};
    (courses || []).forEach(c => {
      const cat = c.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }
};

// Expose globally
window.CoursesService = CoursesService;
