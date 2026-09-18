-- =====================================================================
-- ByteHub Laptop & Desktop Store - Seed Data (MySQL)
-- Run with: npm run seed
-- =====================================================================

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Laptops', 'laptops', 'Business, creator and gaming laptops with clear upgrade guidance', 'laptop'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'laptops');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Desktop Computers', 'desktop-computers', 'Ready-to-use desktop PCs for office, study, gaming and design', 'desktop'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'desktop-computers');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Processors', 'processors', 'Intel and AMD CPUs for desktop builds and upgrades', 'cpu'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'processors');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Graphics Cards', 'graphics-cards', 'GPUs for gaming, rendering, AI and multi-monitor workstations', 'gpu'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'graphics-cards');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Motherboards', 'motherboards', 'Reliable boards for Intel and AMD desktop platforms', 'motherboard'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'motherboards');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Memory', 'memory', 'DDR4 and DDR5 RAM kits for laptops and desktops', 'ram'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'memory');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Storage', 'storage', 'NVMe SSDs and hard drives for speed, backup and capacity', 'ssd'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'storage');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Power & Cabinets', 'power-cabinets', 'PSUs, cabinets and airflow-ready build parts', 'psu'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'power-cabinets');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Cooling', 'cooling', 'CPU coolers and cabinet fans for quiet reliable systems', 'fan'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'cooling');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Monitors', 'monitors', 'Work, gaming and creator displays for desktop setups', 'monitor'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'monitors');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Keyboards & Mice', 'keyboards-mice', 'Input devices for productivity, coding, design and gaming', 'keyboard'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'keyboards-mice');

INSERT INTO categories (id, name, slug, description, icon)
SELECT UUID(), 'Networking', 'networking', 'Routers, Wi-Fi adapters and switches for home or office desktops', 'network'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'networking');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Lenovo ThinkPad E16 Gen 2 Business Laptop', 'lenovo-thinkpad-e16-gen-2-business-laptop', (SELECT id FROM categories WHERE slug = 'laptops'), 'Lenovo', 'ThinkPad E16 Gen 2', 74990.00, 8,
'16-inch business laptop with Ryzen performance, excellent keyboard and practical office durability.',
'A dependable work laptop for accounting, programming, browsing, meetings and everyday office use.',
JSON_ARRAY('16-inch WUXGA anti-glare display','AMD Ryzen 5 performance class','Backlit ThinkPad keyboard','Wi-Fi 6 and privacy shutter','Upgradeable storage support'),
JSON_OBJECT('Processor','AMD Ryzen 5 series','Memory','16GB DDR5','Storage','512GB NVMe SSD','Display','16-inch WUXGA anti-glare','Use Case','Office, study, programming, business'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lenovo-thinkpad-e16-gen-2-business-laptop');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'ASUS TUF Gaming A15 RTX Laptop', 'asus-tuf-gaming-a15-rtx-laptop', (SELECT id FROM categories WHERE slug = 'laptops'), 'ASUS', 'TUF Gaming A15', 89990.00, 5,
'Durable gaming laptop with dedicated RTX graphics, fast display and strong cooling.',
'Built for gaming, 3D learning, video editing and demanding college workloads.',
JSON_ARRAY('Dedicated NVIDIA RTX graphics','High refresh-rate display','Military-grade TUF chassis design','Dual-fan thermal system','RGB backlit keyboard'),
JSON_OBJECT('Processor','AMD Ryzen 7 class','Graphics','NVIDIA GeForce RTX series','Memory','16GB DDR5','Storage','1TB NVMe SSD','Display','15.6-inch FHD high refresh'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'asus-tuf-gaming-a15-rtx-laptop');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Acer Aspire 5 Everyday Laptop', 'acer-aspire-5-everyday-laptop', (SELECT id FROM categories WHERE slug = 'laptops'), 'Acer', 'Aspire 5', 52990.00, 11,
'Reliable laptop for students, home office and daily productivity with SSD speed.',
'A practical daily-use laptop for online classes, office documents, web apps, media and light multitasking.',
JSON_ARRAY('Full HD display','Fast NVMe SSD storage','Thin everyday chassis','Wi-Fi and Bluetooth ready'),
JSON_OBJECT('Processor','Intel Core i5 class','Memory','16GB RAM','Storage','512GB NVMe SSD','Display','15.6-inch FHD','Use Case','Study, office, home productivity'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'acer-aspire-5-everyday-laptop');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'ByteHub Ryzen 7 Creator Desktop', 'bytehub-ryzen-7-creator-desktop', (SELECT id FROM categories WHERE slug = 'desktop-computers'), 'ByteHub Custom', 'R7 Creator', 104990.00, 4,
'Custom desktop for editing, coding, multitasking and creator workloads with upgrade room.',
'A balanced pre-built desktop for customers who want strong CPU performance and fast storage.',
JSON_ARRAY('Ryzen 7 performance desktop','1TB NVMe primary storage','Airflow cabinet with tempered side panel','Future GPU upgrade path','Cable-managed and tested before delivery'),
JSON_OBJECT('Processor','AMD Ryzen 7 7700','Memory','32GB DDR5','Storage','1TB NVMe SSD','Graphics','Integrated / upgrade ready','Cabinet','Airflow mid-tower'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bytehub-ryzen-7-creator-desktop');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'ByteHub Intel Office Desktop', 'bytehub-intel-office-desktop', (SELECT id FROM categories WHERE slug = 'desktop-computers'), 'ByteHub Custom', 'i5 Office Pro', 48990.00, 9,
'Clean office desktop for billing, browsing, Tally, documents and long daily use.',
'A quiet, easy-to-maintain desktop configured for shops, schools, offices and home workstations.',
JSON_ARRAY('Intel Core i5 class processor','Fast boot NVMe SSD','Quiet cabinet and power supply','Windows-ready configuration'),
JSON_OBJECT('Processor','Intel Core i5 class','Memory','16GB DDR4','Storage','512GB NVMe SSD','Graphics','Integrated graphics','Use Case','Office, billing, study'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bytehub-intel-office-desktop');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Intel Core i5-14600K Desktop Processor', 'intel-core-i5-14600k-desktop-processor', (SELECT id FROM categories WHERE slug = 'processors'), 'Intel', 'Core i5-14600K', 28990.00, 6,
'High-performance unlocked desktop CPU for gaming and productivity builds.',
'A strong choice for customers building a gaming PC, editing setup or fast workstation.',
JSON_ARRAY('Unlocked performance CPU','Hybrid core architecture','Great gaming and productivity balance','Requires compatible LGA1700 motherboard'),
JSON_OBJECT('Socket','LGA1700','Class','Performance desktop CPU','Recommended Cooling','Tower air cooler or liquid cooler'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'intel-core-i5-14600k-desktop-processor');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'AMD Ryzen 5 7600 Desktop Processor', 'amd-ryzen-5-7600-desktop-processor', (SELECT id FROM categories WHERE slug = 'processors'), 'AMD', 'Ryzen 5 7600', 21990.00, 7,
'Efficient AM5 processor for modern gaming, coding and productivity desktops.',
'Recommended for customers who want a modern DDR5 platform with excellent everyday speed.',
JSON_ARRAY('AM5 platform support','DDR5 memory support','Efficient 6-core performance class','Good upgrade path'),
JSON_OBJECT('Socket','AM5','Memory Support','DDR5','Use Case','Gaming, study, programming','Compatibility','A620/B650/X670 motherboards'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'amd-ryzen-5-7600-desktop-processor');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'NVIDIA GeForce RTX 4060 8GB Graphics Card', 'nvidia-geforce-rtx-4060-8gb-graphics-card', (SELECT id FROM categories WHERE slug = 'graphics-cards'), 'NVIDIA Partner', 'GeForce RTX 4060 8GB', 31990.00, 5,
'Efficient graphics card for 1080p gaming, CUDA learning and creator acceleration.',
'A smart GPU upgrade for gaming desktops and creator PCs.',
JSON_ARRAY('8GB GDDR6 memory','Ray tracing and DLSS support','Efficient power draw','HDMI and DisplayPort outputs'),
JSON_OBJECT('Memory','8GB GDDR6','Recommended PSU','550W or higher','Use Case','1080p gaming, editing, CUDA learning'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'nvidia-geforce-rtx-4060-8gb-graphics-card');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Crucial 16GB DDR5 Laptop RAM', 'crucial-16gb-ddr5-laptop-ram', (SELECT id FROM categories WHERE slug = 'memory'), 'Crucial', '16GB DDR5 SODIMM', 4690.00, 18,
'Laptop memory upgrade for smoother multitasking and heavier browser workloads.',
'A practical upgrade for compatible DDR5 laptops.',
JSON_ARRAY('16GB DDR5 SODIMM module','Laptop compatible form factor','Improves multitasking','Installation support available'),
JSON_OBJECT('Capacity','16GB','Type','DDR5 SODIMM','Use Case','Laptop RAM upgrade','Compatibility','Check laptop model before purchase'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'crucial-16gb-ddr5-laptop-ram');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Samsung 990 EVO 1TB NVMe SSD', 'samsung-990-evo-1tb-nvme-ssd', (SELECT id FROM categories WHERE slug = 'storage'), 'Samsung', '990 EVO 1TB', 8490.00, 14,
'Fast 1TB NVMe SSD upgrade for laptops and desktops with M.2 support.',
'Recommended for customers who need faster boot, quicker app loading and more storage.',
JSON_ARRAY('1TB NVMe storage','Fast boot and app load times','Laptop and desktop compatible','Good primary-drive upgrade'),
JSON_OBJECT('Capacity','1TB','Interface','M.2 NVMe','Use Case','OS drive, laptop upgrade, desktop storage','Compatibility','M.2 NVMe slot required'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'samsung-990-evo-1tb-nvme-ssd');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'MSI PRO B650M-A WiFi Motherboard', 'msi-pro-b650m-a-wifi-motherboard', (SELECT id FROM categories WHERE slug = 'motherboards'), 'MSI', 'PRO B650M-A WiFi', 17490.00, 4,
'AM5 motherboard with Wi-Fi, DDR5 support and strong everyday expansion.',
'A reliable base for Ryzen 7000 and newer AM5 desktop builds.',
JSON_ARRAY('AM5 socket motherboard','DDR5 memory support','Onboard Wi-Fi','M.2 NVMe support'),
JSON_OBJECT('Socket','AM5','Memory','DDR5','Form Factor','Micro-ATX','Connectivity','Wi-Fi, LAN, USB'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'msi-pro-b650m-a-wifi-motherboard');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Corsair CX650 650W Bronze Power Supply', 'corsair-cx650-650w-bronze-power-supply', (SELECT id FROM categories WHERE slug = 'power-cabinets'), 'Corsair', 'CX650', 5790.00, 10,
'Reliable 650W PSU for office desktops, gaming upgrades and mid-range GPUs.',
'A dependable power supply for customers upgrading from generic PSUs or building a stable desktop.',
JSON_ARRAY('650W rated output','80 Plus Bronze efficiency class','Stable desktop power delivery','Good for mid-range GPU systems'),
JSON_OBJECT('Wattage','650W','Efficiency','80 Plus Bronze class','Use Case','Desktop build, GPU upgrade','Compatibility','ATX cabinets'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'corsair-cx650-650w-bronze-power-supply');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'LG UltraGear 27-inch 144Hz Gaming Monitor', 'lg-ultragear-27-inch-144hz-gaming-monitor', (SELECT id FROM categories WHERE slug = 'monitors'), 'LG', 'UltraGear 27', 18990.00, 6,
'27-inch high refresh monitor for desktop gaming and smooth daily work.',
'A sharp upgrade for desktop customers who want smoother motion and better visuals.',
JSON_ARRAY('27-inch display size','144Hz refresh rate class','Gaming and productivity ready','HDMI and DisplayPort connectivity'),
JSON_OBJECT('Size','27-inch','Refresh Rate','144Hz class','Use Case','Gaming, work, dual monitor','Inputs','HDMI / DisplayPort'), TRUE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lg-ultragear-27-inch-144hz-gaming-monitor');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'Logitech MK345 Wireless Keyboard Mouse Combo', 'logitech-mk345-wireless-keyboard-mouse-combo', (SELECT id FROM categories WHERE slug = 'keyboards-mice'), 'Logitech', 'MK345', 2490.00, 16,
'Full-size wireless keyboard and mouse combo for office desktops and laptops.',
'A comfortable input combo for billing counters, reception desks and home office setups.',
JSON_ARRAY('Wireless keyboard and mouse','Full-size keyboard layout','Comfortable daily typing','USB receiver included'),
JSON_OBJECT('Connection','Wireless USB receiver','Keyboard','Full-size layout','Use Case','Office, home, laptop desk setup'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'logitech-mk345-wireless-keyboard-mouse-combo');

INSERT INTO products (id, name, slug, category_id, brand, model, price, stock_quantity, short_description, description, features, specifications, is_featured)
SELECT UUID(), 'TP-Link Archer AX23 Wi-Fi 6 Router', 'tp-link-archer-ax23-wifi-6-router', (SELECT id FROM categories WHERE slug = 'networking'), 'TP-Link', 'Archer AX23', 4990.00, 8,
'Wi-Fi 6 router for smoother laptop, desktop and small office connectivity.',
'Recommended for homes and small offices using multiple laptops, desktops and phones.',
JSON_ARRAY('Wi-Fi 6 support','Dual-band wireless','Gigabit LAN ports','Suitable for home and small office'),
JSON_OBJECT('Wireless','Wi-Fi 6 dual-band','LAN','Gigabit Ethernet','Use Case','Home office, small office, gaming desk'), FALSE
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tp-link-archer-ax23-wifi-6-router');

INSERT INTO product_images (id, product_id, image_url, is_primary, sort_order)
SELECT UUID(), p.id, image_url, TRUE, 1
FROM products p
JOIN (
  SELECT 'lenovo-thinkpad-e16-gen-2-business-laptop' slug, 'https://placehold.co/600x400/1a1a2e/ffffff?text=ThinkPad+E16' image_url UNION ALL
  SELECT 'asus-tuf-gaming-a15-rtx-laptop',               'https://placehold.co/600x400/1a1a2e/ffffff?text=ASUS+TUF+A15' UNION ALL
  SELECT 'acer-aspire-5-everyday-laptop',                'https://placehold.co/600x400/1a1a2e/ffffff?text=Acer+Aspire+5' UNION ALL
  SELECT 'bytehub-ryzen-7-creator-desktop',              'https://placehold.co/600x400/1a1a2e/ffffff?text=Ryzen+7+Desktop' UNION ALL
  SELECT 'bytehub-intel-office-desktop',                 'https://placehold.co/600x400/1a1a2e/ffffff?text=Intel+Office+PC' UNION ALL
  SELECT 'intel-core-i5-14600k-desktop-processor',       'https://placehold.co/600x400/1a1a2e/ffffff?text=Intel+i5-14600K' UNION ALL
  SELECT 'amd-ryzen-5-7600-desktop-processor',           'https://placehold.co/600x400/1a1a2e/ffffff?text=AMD+Ryzen+5+7600' UNION ALL
  SELECT 'nvidia-geforce-rtx-4060-8gb-graphics-card',    'https://placehold.co/600x400/1a1a2e/ffffff?text=RTX+4060+8GB' UNION ALL
  SELECT 'crucial-16gb-ddr5-laptop-ram',                 'https://placehold.co/600x400/1a1a2e/ffffff?text=Crucial+16GB+DDR5' UNION ALL
  SELECT 'samsung-990-evo-1tb-nvme-ssd',                 'https://placehold.co/600x400/1a1a2e/ffffff?text=Samsung+990+EVO+1TB' UNION ALL
  SELECT 'msi-pro-b650m-a-wifi-motherboard',             'https://placehold.co/600x400/1a1a2e/ffffff?text=MSI+B650M+WiFi' UNION ALL
  SELECT 'corsair-cx650-650w-bronze-power-supply',       'https://placehold.co/600x400/1a1a2e/ffffff?text=Corsair+CX650' UNION ALL
  SELECT 'lg-ultragear-27-inch-144hz-gaming-monitor',    'https://placehold.co/600x400/1a1a2e/ffffff?text=LG+UltraGear+27' UNION ALL
  SELECT 'logitech-mk345-wireless-keyboard-mouse-combo', 'https://placehold.co/600x400/1a1a2e/ffffff?text=Logitech+MK345' UNION ALL
  SELECT 'tp-link-archer-ax23-wifi-6-router',            'https://placehold.co/600x400/1a1a2e/ffffff?text=TP-Link+AX23'
) image_map ON image_map.slug = p.slug
WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id);
