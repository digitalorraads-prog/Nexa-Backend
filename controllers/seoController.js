const Seo = require("../models/Seo");

// Get all SEO entries
exports.getAllSeo = async (req, res) => {
  try {
    const seos = await Seo.find().sort({ updatedAt: -1 });
    res.json(seos);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get SEO by URL
exports.getSeoByUrl = async (req, res) => {
  try {
    let url = decodeURIComponent(req.params.url);
    if (!url.startsWith("/")) url = "/" + url;

    // Search for exact path OR a record that ends with this path (to handle full URL mistakes)
    let seo = await Seo.findOne({ 
      $or: [
        { pageUrl: url },
        { pageUrl: { $regex: new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "$") } }
      ]
    });
    
    if (!seo) {
      return res.status(404).json({ message: "SEO data not found" });
    }
    
    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create new SEO entry
exports.createSeo = async (req, res) => {
  let { pageUrl, metaTitle, metaDescription, metaKeywords, canonicalUrl, robotsTag } = req.body;

  // Clean the URL: only store the pathname
  try {
    if (pageUrl.startsWith("http")) {
      pageUrl = new URL(pageUrl).pathname;
    }
    if (!pageUrl.startsWith("/")) {
      pageUrl = "/" + pageUrl;
    }
  } catch (e) {
    // Keep original if parsing fails
  }

  try {
    const creatorEmail = req.session.seoUser?.email || req.session.admin?.email || "Unknown";
    const newSeo = new Seo({
      pageUrl,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      robotsTag,
      createdBy: creatorEmail,
      updatedBy: creatorEmail
    });

    const savedSeo = await newSeo.save();
    res.status(201).json(savedSeo);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "SEO entry already exists for this URL" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update SEO entry
exports.updateSeo = async (req, res) => {
  try {
    const updaterEmail = req.session.seoUser?.email || req.session.admin?.email || "Unknown";
    let updateData = { ...req.body, updatedBy: updaterEmail, updatedAt: Date.now() };
    
    // Clean the URL if it's being updated
    if (updateData.pageUrl) {
      try {
        if (updateData.pageUrl.startsWith("http")) {
          updateData.pageUrl = new URL(updateData.pageUrl).pathname;
        }
        if (!updateData.pageUrl.startsWith("/")) {
          updateData.pageUrl = "/" + updateData.pageUrl;
        }
      } catch (e) {}
    }

    const updatedSeo = await Seo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSeo) {
      return res.status(404).json({ message: "SEO entry not found" });
    }

    res.json(updatedSeo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete SEO entry
exports.deleteSeo = async (req, res) => {
  try {
    const seo = await Seo.findByIdAndDelete(req.params.id);

    if (!seo) {
      return res.status(404).json({ message: "SEO entry not found" });
    }

    res.json({ message: "SEO entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
