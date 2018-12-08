module.exports = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/");
    },
    checkingisAdmin: function (req, res, next) {
        if (req.user) {
            if (req.user.role) {
                return next();
            }
        }
        res.redirect('/users/login')
    },
    getCategory: function (req, res, next) {
        req.getConnection(function (err, connection) {
            if (err) return next(err);
            //var categoriesQuery = `SELECT * FROM category GROUP BY parent`;
            var categoriesQuery = `SELECT * FROM categories`;
            connection.query(categoriesQuery, [], function (err, rows) {
                var topCategory = rows.filter(row => row.parent === 0);
                var middle = rows.filter(function (row) {
                    var a = String(row.parent);
                    var b = String(row.fullPath).charAt(0);
                    return a === b;
                });
                middle = JSON.parse(JSON.stringify(middle));
                var catArray = [];
                var category;
                var parentCategories = [];
                topCategory.forEach(function (row) {
                    category = {
                        categoryTitle: row.name,
                        categoryAlias: row.alias,
                        subCategory: []
                    };
                    for (i = 0; i < middle.length; i++) {
                        if (middle[i].parent == row.fullPath) {
                            middle[i].parentAlias = row.alias;
                            category.subCategory.push(middle[i]);
                        }
                    }
                    catArray.push(category);
                });
                res.locals.category = catArray;
                res.locals.parentCategories = parentCategories
            });
        });
        return next();
    }
}