// ──────────────────────────────────────────────
// PNG Minify — Programmatic SEO Variant Generator
// Generates 210 unique landing pages for long-tail keywords
// ──────────────────────────────────────────────

export interface VariantStep {
  title: string;
  text: string;
}

export interface VariantFaq {
  q: string;
  a: string;
}

export interface SeoVariant {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  bodyParagraphs: string[];
  steps: VariantStep[];
  faqs: VariantFaq[];
  relatedSlugs: string[];
  keywords: string[];
}

interface VariantSeed {
  slug: string;
  label: string;
  keyword: string;
  category:
    | "platform"
    | "device"
    | "size"
    | "attribute"
    | "use-case"
    | "action";
}

// ─── SEED DATA (210 unique variants) ──────────────────────

const PLATFORM_SEEDS: VariantSeed[] = [
  { slug: "compress-png-for-email", label: "for Email", keyword: "for email attachments", category: "platform" },
  { slug: "compress-png-for-gmail", label: "for Gmail", keyword: "for Gmail", category: "platform" },
  { slug: "compress-png-for-outlook", label: "for Outlook", keyword: "for Outlook email", category: "platform" },
  { slug: "compress-png-for-slack", label: "for Slack", keyword: "for Slack messages", category: "platform" },
  { slug: "compress-png-for-discord", label: "for Discord", keyword: "for Discord uploads", category: "platform" },
  { slug: "compress-png-for-whatsapp", label: "for WhatsApp", keyword: "for WhatsApp sharing", category: "platform" },
  { slug: "compress-png-for-telegram", label: "for Telegram", keyword: "for Telegram", category: "platform" },
  { slug: "compress-png-for-wordpress", label: "for WordPress", keyword: "for WordPress sites", category: "platform" },
  { slug: "compress-png-for-shopify", label: "for Shopify", keyword: "for Shopify stores", category: "platform" },
  { slug: "compress-png-for-squarespace", label: "for Squarespace", keyword: "for Squarespace websites", category: "platform" },
  { slug: "compress-png-for-wix", label: "for Wix", keyword: "for Wix websites", category: "platform" },
  { slug: "compress-png-for-webflow", label: "for Webflow", keyword: "for Webflow projects", category: "platform" },
  { slug: "compress-png-for-figma", label: "for Figma", keyword: "for Figma exports", category: "platform" },
  { slug: "compress-png-for-canva", label: "for Canva", keyword: "for Canva designs", category: "platform" },
  { slug: "compress-png-for-google-drive", label: "for Google Drive", keyword: "for Google Drive storage", category: "platform" },
  { slug: "compress-png-for-dropbox", label: "for Dropbox", keyword: "for Dropbox uploads", category: "platform" },
  { slug: "compress-png-for-notion", label: "for Notion", keyword: "for Notion pages", category: "platform" },
  { slug: "compress-png-for-trello", label: "for Trello", keyword: "for Trello boards", category: "platform" },
  { slug: "compress-png-for-github", label: "for GitHub", keyword: "for GitHub README files", category: "platform" },
  { slug: "compress-png-for-twitter", label: "for Twitter/X", keyword: "for Twitter posts", category: "platform" },
  { slug: "compress-png-for-facebook", label: "for Facebook", keyword: "for Facebook uploads", category: "platform" },
  { slug: "compress-png-for-instagram", label: "for Instagram", keyword: "for Instagram stories", category: "platform" },
  { slug: "compress-png-for-linkedin", label: "for LinkedIn", keyword: "for LinkedIn posts", category: "platform" },
  { slug: "compress-png-for-pinterest", label: "for Pinterest", keyword: "for Pinterest pins", category: "platform" },
  { slug: "compress-png-for-tiktok", label: "for TikTok", keyword: "for TikTok thumbnails", category: "platform" },
  { slug: "compress-png-for-reddit", label: "for Reddit", keyword: "for Reddit posts", category: "platform" },
  { slug: "compress-png-for-etsy", label: "for Etsy", keyword: "for Etsy product listings", category: "platform" },
  { slug: "compress-png-for-amazon", label: "for Amazon", keyword: "for Amazon product images", category: "platform" },
  { slug: "compress-png-for-ebay", label: "for eBay", keyword: "for eBay listings", category: "platform" },
  { slug: "compress-png-for-google-docs", label: "for Google Docs", keyword: "for Google Docs", category: "platform" },
  { slug: "compress-png-for-google-slides", label: "for Google Slides", keyword: "for Google Slides presentations", category: "platform" },
  { slug: "compress-png-for-powerpoint", label: "for PowerPoint", keyword: "for PowerPoint slides", category: "platform" },
  { slug: "compress-png-for-keynote", label: "for Keynote", keyword: "for Apple Keynote", category: "platform" },
  { slug: "compress-png-for-jira", label: "for Jira", keyword: "for Jira tickets", category: "platform" },
  { slug: "compress-png-for-confluence", label: "for Confluence", keyword: "for Confluence pages", category: "platform" },
  { slug: "compress-png-for-asana", label: "for Asana", keyword: "for Asana tasks", category: "platform" },
  { slug: "compress-png-for-microsoft-teams", label: "for Microsoft Teams", keyword: "for Microsoft Teams", category: "platform" },
  { slug: "compress-png-for-zoom", label: "for Zoom", keyword: "for Zoom chat", category: "platform" },
  { slug: "compress-png-for-hubspot", label: "for HubSpot", keyword: "for HubSpot CMS", category: "platform" },
  { slug: "compress-png-for-mailchimp", label: "for Mailchimp", keyword: "for Mailchimp newsletters", category: "platform" },
];

const DEVICE_SEEDS: VariantSeed[] = [
  { slug: "compress-png-on-iphone", label: "on iPhone", keyword: "on iPhone", category: "device" },
  { slug: "compress-png-on-android", label: "on Android", keyword: "on Android phone", category: "device" },
  { slug: "compress-png-on-ipad", label: "on iPad", keyword: "on iPad", category: "device" },
  { slug: "compress-png-on-mac", label: "on Mac", keyword: "on Mac", category: "device" },
  { slug: "compress-png-on-windows", label: "on Windows", keyword: "on Windows PC", category: "device" },
  { slug: "compress-png-on-linux", label: "on Linux", keyword: "on Linux", category: "device" },
  { slug: "compress-png-on-chromebook", label: "on Chromebook", keyword: "on Chromebook", category: "device" },
  { slug: "compress-png-on-mobile", label: "on Mobile", keyword: "on mobile devices", category: "device" },
  { slug: "compress-png-on-tablet", label: "on Tablet", keyword: "on tablet", category: "device" },
  { slug: "compress-png-on-samsung", label: "on Samsung", keyword: "on Samsung Galaxy", category: "device" },
];

const SIZE_SEEDS: VariantSeed[] = [
  { slug: "compress-png-under-50kb", label: "Under 50 KB", keyword: "to under 50 KB", category: "size" },
  { slug: "compress-png-under-100kb", label: "Under 100 KB", keyword: "to under 100 KB", category: "size" },
  { slug: "compress-png-under-200kb", label: "Under 200 KB", keyword: "to under 200 KB", category: "size" },
  { slug: "compress-png-under-500kb", label: "Under 500 KB", keyword: "to under 500 KB", category: "size" },
  { slug: "compress-png-under-1mb", label: "Under 1 MB", keyword: "to under 1 MB", category: "size" },
  { slug: "compress-png-under-2mb", label: "Under 2 MB", keyword: "to under 2 MB", category: "size" },
  { slug: "compress-png-under-5mb", label: "Under 5 MB", keyword: "to under 5 MB", category: "size" },
  { slug: "compress-png-to-50kb", label: "to 50 KB", keyword: "to exactly 50 KB", category: "size" },
  { slug: "compress-png-to-100kb", label: "to 100 KB", keyword: "to exactly 100 KB", category: "size" },
  { slug: "compress-png-to-200kb", label: "to 200 KB", keyword: "to exactly 200 KB", category: "size" },
  { slug: "compress-png-to-500kb", label: "to 500 KB", keyword: "to exactly 500 KB", category: "size" },
  { slug: "compress-png-to-1mb", label: "to 1 MB", keyword: "to exactly 1 MB", category: "size" },
  { slug: "reduce-png-below-100kb", label: "Below 100 KB", keyword: "below 100 KB", category: "size" },
  { slug: "reduce-png-below-500kb", label: "Below 500 KB", keyword: "below 500 KB", category: "size" },
  { slug: "reduce-png-below-1mb", label: "Below 1 MB", keyword: "below 1 MB", category: "size" },
  { slug: "compress-png-to-20kb", label: "to 20 KB", keyword: "to 20 KB for icons", category: "size" },
  { slug: "compress-png-under-25kb", label: "Under 25 KB", keyword: "to under 25 KB", category: "size" },
  { slug: "compress-png-under-10mb", label: "Under 10 MB", keyword: "to under 10 MB", category: "size" },
  { slug: "compress-png-under-300kb", label: "Under 300 KB", keyword: "to under 300 KB", category: "size" },
  { slug: "compress-png-under-150kb", label: "Under 150 KB", keyword: "to under 150 KB", category: "size" },
];

const ATTRIBUTE_SEEDS: VariantSeed[] = [
  { slug: "compress-png-without-losing-quality", label: "Without Losing Quality", keyword: "without losing quality", category: "attribute" },
  { slug: "compress-png-lossless", label: "Lossless", keyword: "using lossless compression", category: "attribute" },
  { slug: "compress-png-high-quality", label: "High Quality", keyword: "with high quality output", category: "attribute" },
  { slug: "compress-png-fast", label: "Fast", keyword: "instantly in seconds", category: "attribute" },
  { slug: "compress-png-secure", label: "Securely", keyword: "with maximum security", category: "attribute" },
  { slug: "compress-png-no-watermark", label: "No Watermark", keyword: "without any watermark", category: "attribute" },
  { slug: "compress-png-batch", label: "Batch", keyword: "in batch mode", category: "attribute" },
  { slug: "compress-png-bulk", label: "Bulk", keyword: "in bulk", category: "attribute" },
  { slug: "compress-png-free", label: "Free", keyword: "completely free", category: "attribute" },
  { slug: "compress-png-online", label: "Online", keyword: "online without software", category: "attribute" },
  { slug: "compress-png-no-signup", label: "No Signup", keyword: "without creating an account", category: "attribute" },
  { slug: "compress-png-no-upload", label: "No Upload", keyword: "without uploading to a server", category: "attribute" },
  { slug: "compress-png-private", label: "Privately", keyword: "with complete privacy", category: "attribute" },
  { slug: "compress-png-no-software", label: "No Software", keyword: "without installing software", category: "attribute" },
  { slug: "compress-png-no-limit", label: "No Limit", keyword: "with no file limit", category: "attribute" },
  { slug: "compress-png-unlimited", label: "Unlimited", keyword: "with unlimited usage", category: "attribute" },
  { slug: "compress-png-with-transparency", label: "With Transparency", keyword: "while keeping transparency", category: "attribute" },
  { slug: "compress-transparent-png", label: "Transparent PNG", keyword: "with alpha channel preserved", category: "attribute" },
  { slug: "compress-png-keep-metadata", label: "Keep Metadata", keyword: "while preserving metadata", category: "attribute" },
  { slug: "compress-png-drag-and-drop", label: "Drag and Drop", keyword: "with drag and drop", category: "attribute" },
];

const USECASE_SEEDS: VariantSeed[] = [
  { slug: "compress-png-for-web", label: "for Web", keyword: "for web pages", category: "use-case" },
  { slug: "compress-png-for-website", label: "for Website", keyword: "for website optimization", category: "use-case" },
  { slug: "compress-png-for-blog", label: "for Blog", keyword: "for blog posts", category: "use-case" },
  { slug: "compress-png-for-ecommerce", label: "for E-commerce", keyword: "for e-commerce stores", category: "use-case" },
  { slug: "compress-png-for-print", label: "for Print", keyword: "for print-ready files", category: "use-case" },
  { slug: "compress-png-for-presentation", label: "for Presentation", keyword: "for presentations", category: "use-case" },
  { slug: "compress-png-for-app", label: "for App", keyword: "for mobile apps", category: "use-case" },
  { slug: "compress-png-for-game", label: "for Game", keyword: "for game assets", category: "use-case" },
  { slug: "compress-png-for-icon", label: "for Icons", keyword: "for icon files", category: "use-case" },
  { slug: "compress-png-for-logo", label: "for Logo", keyword: "for logo files", category: "use-case" },
  { slug: "compress-png-for-banner", label: "for Banner", keyword: "for web banners", category: "use-case" },
  { slug: "compress-png-for-thumbnail", label: "for Thumbnail", keyword: "for video thumbnails", category: "use-case" },
  { slug: "compress-png-for-avatar", label: "for Avatar", keyword: "for profile pictures", category: "use-case" },
  { slug: "compress-png-for-screenshot", label: "for Screenshot", keyword: "for screenshots", category: "use-case" },
  { slug: "compress-png-for-ui-design", label: "for UI Design", keyword: "for UI/UX design assets", category: "use-case" },
  { slug: "compress-png-for-social-media", label: "for Social Media", keyword: "for social media posts", category: "use-case" },
  { slug: "compress-png-for-developers", label: "for Developers", keyword: "for software developers", category: "use-case" },
  { slug: "compress-png-for-designers", label: "for Designers", keyword: "for graphic designers", category: "use-case" },
  { slug: "compress-png-for-photographers", label: "for Photographers", keyword: "for professional photographers", category: "use-case" },
  { slug: "compress-png-for-students", label: "for Students", keyword: "for student projects", category: "use-case" },
  { slug: "compress-png-for-teachers", label: "for Teachers", keyword: "for educational materials", category: "use-case" },
  { slug: "compress-png-for-business", label: "for Business", keyword: "for business documents", category: "use-case" },
  { slug: "compress-png-for-marketing", label: "for Marketing", keyword: "for marketing campaigns", category: "use-case" },
  { slug: "compress-png-for-seo", label: "for SEO", keyword: "for search engine optimization", category: "use-case" },
  { slug: "compress-png-for-page-speed", label: "for Page Speed", keyword: "to improve page speed", category: "use-case" },
  { slug: "compress-png-for-core-web-vitals", label: "for Core Web Vitals", keyword: "to pass Core Web Vitals", category: "use-case" },
  { slug: "compress-png-for-newsletter", label: "for Newsletter", keyword: "for email newsletters", category: "use-case" },
  { slug: "compress-png-for-pdf", label: "for PDF", keyword: "before embedding in PDF", category: "use-case" },
  { slug: "compress-png-for-document", label: "for Document", keyword: "for Word documents", category: "use-case" },
  { slug: "compress-png-for-portfolio", label: "for Portfolio", keyword: "for portfolio websites", category: "use-case" },
  { slug: "compress-png-for-resume", label: "for Resume", keyword: "for resume attachments", category: "use-case" },
  { slug: "compress-png-for-product-images", label: "for Product Images", keyword: "for product photography", category: "use-case" },
  { slug: "compress-png-for-infographic", label: "for Infographic", keyword: "for infographic images", category: "use-case" },
  { slug: "compress-png-for-sprite-sheet", label: "for Sprite Sheet", keyword: "for CSS sprite sheets", category: "use-case" },
  { slug: "compress-png-for-retina-display", label: "for Retina Display", keyword: "for retina/HiDPI displays", category: "use-case" },
  { slug: "compress-png-for-lazy-loading", label: "for Lazy Loading", keyword: "for lazy loaded images", category: "use-case" },
  { slug: "compress-png-for-cdn", label: "for CDN", keyword: "for CDN delivery", category: "use-case" },
  { slug: "compress-png-for-api", label: "for API", keyword: "for API responses", category: "use-case" },
  { slug: "compress-png-for-react", label: "for React", keyword: "for React applications", category: "use-case" },
  { slug: "compress-png-for-next-js", label: "for Next.js", keyword: "for Next.js projects", category: "use-case" },
];

const ACTION_SEEDS: VariantSeed[] = [
  { slug: "reduce-png-file-size", label: "Reduce File Size", keyword: "reduce png file size", category: "action" },
  { slug: "shrink-png-images", label: "Shrink PNG", keyword: "shrink png image files", category: "action" },
  { slug: "optimize-png-for-web", label: "Optimize for Web", keyword: "optimize png images for web", category: "action" },
  { slug: "minimize-png-size", label: "Minimize Size", keyword: "minimize png file size", category: "action" },
  { slug: "make-png-smaller", label: "Make Smaller", keyword: "make png files smaller", category: "action" },
  { slug: "png-size-reducer", label: "Size Reducer", keyword: "png size reducer tool", category: "action" },
  { slug: "png-file-optimizer", label: "File Optimizer", keyword: "png file optimizer", category: "action" },
  { slug: "png-image-compressor", label: "Image Compressor", keyword: "png image compressor online", category: "action" },
  { slug: "bulk-png-optimizer", label: "Bulk Optimizer", keyword: "bulk png optimization", category: "action" },
  { slug: "compress-large-png", label: "Compress Large PNG", keyword: "compress large png files", category: "action" },
  { slug: "compress-multiple-png", label: "Compress Multiple", keyword: "compress multiple png files at once", category: "action" },
  { slug: "compress-png-files", label: "Compress Files", keyword: "compress png files online", category: "action" },
  { slug: "png-compressor-tool", label: "Compressor Tool", keyword: "free png compressor tool", category: "action" },
  { slug: "best-png-compressor", label: "Best Compressor", keyword: "best png compressor online", category: "action" },
  { slug: "png-optimizer-online", label: "Optimizer Online", keyword: "png optimizer online free", category: "action" },
  { slug: "reduce-png-quality", label: "Reduce Quality", keyword: "reduce png quality and size", category: "action" },
  { slug: "compress-png-images-online", label: "Compress Online", keyword: "compress png images online free", category: "action" },
  { slug: "compress-png-to-jpg-size", label: "To JPG Size", keyword: "compress png to jpg file size", category: "action" },
  { slug: "png-to-smaller-png", label: "To Smaller PNG", keyword: "convert png to smaller png", category: "action" },
  { slug: "compress-png-without-alpha-loss", label: "Without Alpha Loss", keyword: "compress png preserving alpha channel", category: "action" },
  { slug: "compress-png-24", label: "Compress PNG-24", keyword: "compress png-24 format images", category: "action" },
  { slug: "compress-png-8", label: "Compress PNG-8", keyword: "compress png-8 format images", category: "action" },
  { slug: "compress-4k-png", label: "Compress 4K PNG", keyword: "compress 4K resolution png files", category: "action" },
  { slug: "compress-hd-png", label: "Compress HD PNG", keyword: "compress high resolution png images", category: "action" },
  { slug: "compress-png-for-email-attachment", label: "For Email Attachment", keyword: "compress png for email attachment size limit", category: "action" },
  { slug: "compress-png-80-percent", label: "80% Smaller", keyword: "compress png by 80 percent", category: "action" },
  { slug: "compress-png-50-percent", label: "50% Smaller", keyword: "compress png by 50 percent", category: "action" },
  { slug: "compress-png-70-percent", label: "70% Smaller", keyword: "reduce png size by 70 percent", category: "action" },
  { slug: "compress-png-90-percent", label: "90% Smaller", keyword: "compress png by 90 percent", category: "action" },
  { slug: "png-minifier", label: "PNG Minifier", keyword: "png minifier tool online", category: "action" },
  { slug: "png-reducer", label: "PNG Reducer", keyword: "png file size reducer", category: "action" },
  { slug: "png-shrinker", label: "PNG Shrinker", keyword: "png image shrinker", category: "action" },
  { slug: "png-squeezer", label: "PNG Squeezer", keyword: "squeeze png file size", category: "action" },
  { slug: "tiny-png-alternative", label: "TinyPNG Alternative", keyword: "free tinypng alternative", category: "action" },
  { slug: "compress-png-like-tinypng", label: "Like TinyPNG", keyword: "compress png like tinypng for free", category: "action" },
  { slug: "compress-png-no-quality-loss", label: "No Quality Loss", keyword: "compress png with zero quality loss", category: "action" },
  { slug: "compress-png-preserve-colors", label: "Preserve Colors", keyword: "compress png while preserving colors", category: "action" },
  { slug: "compress-png-for-web-performance", label: "For Web Performance", keyword: "compress png for better web performance", category: "action" },
  { slug: "compress-png-for-faster-loading", label: "For Faster Loading", keyword: "compress png for faster page loading", category: "action" },
  { slug: "compress-png-for-bandwidth", label: "Save Bandwidth", keyword: "compress png to save bandwidth", category: "action" },
  { slug: "compress-png-for-storage", label: "Save Storage", keyword: "compress png to save storage space", category: "action" },
  { slug: "compress-png-before-upload", label: "Before Upload", keyword: "compress png before uploading", category: "action" },
  { slug: "compress-png-after-screenshot", label: "After Screenshot", keyword: "compress png after taking screenshot", category: "action" },
  { slug: "compress-png-from-photoshop", label: "From Photoshop", keyword: "compress photoshop png exports", category: "action" },
  { slug: "compress-png-from-illustrator", label: "From Illustrator", keyword: "compress illustrator png exports", category: "action" },
  { slug: "compress-png-from-sketch", label: "From Sketch", keyword: "compress sketch png exports", category: "action" },
  { slug: "compress-png-from-figma-export", label: "From Figma Export", keyword: "compress figma png exports", category: "action" },
  { slug: "compress-png-from-canva-export", label: "From Canva Export", keyword: "compress canva png exports", category: "action" },
  { slug: "compress-png-for-google-pagespeed", label: "For Google PageSpeed", keyword: "compress png to improve Google PageSpeed score", category: "action" },
  { slug: "compress-png-for-lighthouse", label: "For Lighthouse", keyword: "compress png to pass Lighthouse audit", category: "action" },
  { slug: "compress-png-for-gtmetrix", label: "For GTmetrix", keyword: "compress png to improve GTmetrix score", category: "action" },
  { slug: "compress-png-animation", label: "Animated PNG", keyword: "compress animated apng files", category: "action" },
  { slug: "compress-png-with-text", label: "PNG With Text", keyword: "compress png images containing text", category: "action" },
  { slug: "compress-png-chart", label: "PNG Chart", keyword: "compress png chart and graph images", category: "action" },
  { slug: "compress-png-diagram", label: "PNG Diagram", keyword: "compress png diagram images", category: "action" },
  { slug: "compress-png-scan", label: "Scanned PNG", keyword: "compress scanned png documents", category: "action" },
  { slug: "compress-png-photo", label: "PNG Photo", keyword: "compress photographic png images", category: "action" },
  { slug: "compress-png-artwork", label: "Digital Artwork", keyword: "compress digital artwork png files", category: "action" },
  { slug: "compress-png-map", label: "Map PNG", keyword: "compress map and geographic png images", category: "action" },
  { slug: "compress-png-wireframe", label: "Wireframe PNG", keyword: "compress wireframe and mockup png files", category: "action" },
  { slug: "compress-png-medical-image", label: "Medical Image", keyword: "compress medical imaging png files", category: "action" },
  { slug: "compress-png-scientific", label: "Scientific Image", keyword: "compress scientific research png images", category: "action" },
  { slug: "free-online-png-compressor", label: "Free Online Tool", keyword: "free online png compressor no signup", category: "action" },
  { slug: "browser-based-png-compressor", label: "Browser-Based", keyword: "browser-based png compression tool", category: "action" },
  { slug: "client-side-png-compression", label: "Client-Side", keyword: "client-side png compression in browser", category: "action" },
  { slug: "instant-png-compression", label: "Instant Compression", keyword: "instant png compression online", category: "action" },
  { slug: "one-click-png-compress", label: "One Click", keyword: "one click png compression", category: "action" },
  { slug: "compress-png-in-seconds", label: "In Seconds", keyword: "compress png files in seconds", category: "action" },
  { slug: "compress-png-zip-download", label: "ZIP Download", keyword: "compress png and download as zip", category: "action" },
  { slug: "compress-png-maintain-resolution", label: "Maintain Resolution", keyword: "compress png without reducing resolution", category: "action" },
  { slug: "compress-png-for-html-email", label: "For HTML Email", keyword: "compress png for HTML email templates", category: "action" },
];

// ─── Combine all seeds ────────────────────────

const ALL_SEEDS: VariantSeed[] = [
  ...PLATFORM_SEEDS,
  ...DEVICE_SEEDS,
  ...SIZE_SEEDS,
  ...ATTRIBUTE_SEEDS,
  ...USECASE_SEEDS,
  ...ACTION_SEEDS,
];

// Deduplicate by slug
const UNIQUE_SEEDS: VariantSeed[] = Array.from(
  new Map(ALL_SEEDS.map((s) => [s.slug, s])).values()
);

// ─── BODY TEMPLATE ────────────────────────────

function bodyTemplate(label: string, keyword: string): string[] {
  return [
    `PNG Minify makes it easy to compress your PNG images ${keyword}. Our browser-based compression engine processes your files locally — your images never leave your device. This means complete privacy and instant results, no matter where you are or what device you use. Whether you need to reduce file sizes for faster page loads, meet upload size limits, or simply save storage space, PNG Minify handles it all with a few clicks.`,

    `When you compress PNG files ${keyword}, PNG Minify applies smart optimization algorithms that analyze each pixel and remove unnecessary data while preserving visual quality. The tool works entirely in your browser using modern JavaScript APIs and Web Workers, so there is no server processing, no queues, and no waiting. You can compress up to 20 PNG files at once, adjust the compression level with an intuitive slider, and download results individually or as a single ZIP archive.`,

    `PNG Minify is the ideal choice ${label.toLowerCase().startsWith("for") ? label.toLowerCase() : `for ${label.toLowerCase()} use cases`}. Unlike other tools that require uploads to remote servers, PNG Minify keeps everything local. Your original files are never modified — you always get a new, optimized copy. The tool is completely free, requires no signup or account, and works on any modern browser across desktop and mobile devices. Start compressing your PNGs today and experience the difference lighter images make.`,
  ];
}

// ─── DEFAULT STEPS ────────────────────────────

function defaultSteps(keyword: string): VariantStep[] {
  return [
    {
      title: "Upload your PNG files",
      text: `Drag and drop your PNG images into the upload area, or click "Choose PNG files" to browse. PNG Minify accepts up to 20 files at once (max 50 MB each). Your files stay on your device — nothing is uploaded to a server.`,
    },
    {
      title: "Adjust compression level",
      text: `Use the quality slider to set your target compression level. Move it lower for maximum file size reduction, or keep it higher to preserve more detail. The tool shows real-time progress and compression ratio for each file.`,
    },
    {
      title: "Download compressed files",
      text: `Once compression is complete, download each file individually or click "Download all" to get a ZIP archive with all your optimized PNGs. Your compressed images ${keyword} are ready to use immediately.`,
    },
  ];
}

// ─── DEFAULT FAQs ─────────────────────────────

function defaultFaqs(label: string, keyword: string): VariantFaq[] {
  return [
    {
      q: `Is PNG Minify free to use ${keyword}?`,
      a: `Yes, PNG Minify is completely free. There are no hidden fees, usage limits, or premium tiers. You can compress as many PNG files as you need ${keyword} without paying anything.`,
    },
    {
      q: `Are my images uploaded to a server when compressing ${keyword}?`,
      a: `No. PNG Minify runs entirely in your browser. Your PNG files never leave your device. All compression happens locally using JavaScript, ensuring complete privacy and security.`,
    },
    {
      q: `What is the maximum file size I can compress?`,
      a: `Each PNG file can be up to 50 MB, and you can compress up to 20 files at a time. This is more than enough for most ${label.toLowerCase().replace(/^(for |on )/, "")} workflows.`,
    },
    {
      q: `How much can PNG Minify reduce my file size?`,
      a: `Typical savings range from 30% to 80%, depending on the PNG content. Photographic PNGs and screenshots tend to compress more than simple graphics or icons.`,
    },
    {
      q: `Does compression affect image quality?`,
      a: `PNG Minify uses smart compression that minimizes visible quality loss. You can adjust the compression slider to find the perfect balance between file size and visual quality for your specific use case.`,
    },
    {
      q: `Can I compress transparent PNG files?`,
      a: `Yes. PNG Minify fully supports PNG files with transparency (alpha channel). The transparent areas are preserved during compression.`,
    },
  ];
}

// ─── BUILD VARIANT ────────────────────────────

function buildVariant(seed: VariantSeed, allSlugs: string[]): SeoVariant {
  const { slug, label, keyword } = seed;

  const h1 = slug.startsWith("compress-png-")
    ? `Compress PNG ${label}`
    : label.includes("PNG")
      ? label
      : `${label} — PNG Compressor`;

  const title = `${h1} — Free Online | PNG Minify`;

  const description = `Compress PNG images ${keyword}. Free browser-based tool — no upload, no signup. Reduce PNG file size up to 80% without losing quality.`;

  const intro = `Use PNG Minify to compress your PNG images ${keyword}. Fast, free, and 100% private — your files never leave your browser.`;

  // Select 5 related slugs deterministically
  const others = allSlugs.filter((s) => s !== slug);
  const startIdx = Math.abs(hashCode(slug)) % Math.max(1, others.length - 5);
  const relatedSlugs = others.slice(startIdx, startIdx + 5);
  if (relatedSlugs.length < 5) {
    relatedSlugs.push(...others.slice(0, 5 - relatedSlugs.length));
  }

  const keywords = [
    seed.keyword,
    `compress png ${keyword}`,
    "free png compressor",
    "png minify",
    "reduce png file size",
    "compress png online",
    `png compressor ${label.toLowerCase()}`,
  ];

  return {
    slug,
    title,
    h1,
    description,
    intro,
    bodyParagraphs: bodyTemplate(label, keyword),
    steps: defaultSteps(keyword),
    faqs: defaultFaqs(label, keyword),
    relatedSlugs,
    keywords,
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return hash;
}

// ─── PUBLIC API ───────────────────────────────

let _cached: SeoVariant[] | null = null;

export function getAllVariants(): SeoVariant[] {
  if (_cached) return _cached;
  const allSlugs = UNIQUE_SEEDS.map((s) => s.slug);
  _cached = UNIQUE_SEEDS.map((seed) => buildVariant(seed, allSlugs));
  return _cached;
}

export function getVariant(slug: string): SeoVariant | undefined {
  return getAllVariants().find((v) => v.slug === slug);
}

export function getVariantSlugs(): string[] {
  return UNIQUE_SEEDS.map((s) => s.slug);
}

export function getRelatedVariants(
  slugs: string[]
): Array<{ slug: string; h1: string; href: string }> {
  const all = getAllVariants();
  return slugs
    .map((s) => all.find((v) => v.slug === s))
    .filter(Boolean)
    .map((v) => ({
      slug: v!.slug,
      h1: v!.h1,
      href: `/compress/${v!.slug}`,
    }));
}
