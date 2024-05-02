// Example JSON file database:
let example_db = {};
function db_save() {
    try {
        const exampleDB = fs.writeFileSync('./example_db.json', JSON.stringify(example_db), 'utf8');
        example_db = JSON.parse(exampleDB);
        return true;
    } catch (dbError) {
        return false;
    }
}
function db_load() {
    try {
        const exampleDB = fs.readFileSync('./example_db.json', 'utf8');
        example_db = JSON.parse(exampleDB);
        return true;
    } catch (dbError) {
        return false;
    }
}
const currentDB = db_load();
if (currentDB) {
    example_db = currentDB;
    console.log("Successfully Loaded Example DB!");
} else {
    console.log("Example DB doesn't exist, creating...")
    db_save();
}
//

module.exports = {
    example_db,
    db_load,
    db_save
}