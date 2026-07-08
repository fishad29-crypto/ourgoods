const fs = require('fs');
const path = require('path');

const sqlFile = path.join(__dirname, 'extracted_all', 'shop.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

const categories = [];

const lines = sql.split('\n');
for (const line of lines) {
    if (line.startsWith('INSERT INTO `categories`')) {
        // e.g. INSERT INTO `categories` (`id`, `parent_id`, `level`, `name`, ...) VALUES (1, 0, 0, 'Men', ...), (2, 1, 1, 'Shirts', ...);
        const valuesPart = line.substring(line.indexOf('VALUES') + 6).trim();
        // naive split by '),(' might be tricky due to strings, let's use a regex
        const regex = /\((\d+),\s*(\d+),\s*(\d+),\s*'([^']*)'/g;
        let match;
        while ((match = regex.exec(valuesPart)) !== null) {
            categories.push({
                id: parseInt(match[1]),
                parent_id: parseInt(match[2]),
                level: parseInt(match[3]),
                name: match[4]
            });
        }
    }
}

console.log(JSON.stringify(categories, null, 2));
fs.writeFileSync('extracted_categories.json', JSON.stringify(categories, null, 2));
