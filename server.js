const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
    secret: "brazilSecretKey",
    resave: false,
    saveUninitialized: false
}));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/video", express.static(path.join(__dirname, "video")));
app.get("/gallery-images", (req, res) => {
    const folders = ["southeast", "north", "northeast", "south", "central"];
    const gallery = {};
    folders.forEach(folder => {
        const folderPath = path.join(__dirname, "images", "gallery", folder);
        try {
            const files = fs.readdirSync(folderPath);
            gallery[folder] = files.filter(file =>
                file.endsWith(".jpg") ||
                file.endsWith(".jpeg") ||
                file.endsWith(".png") ||
                file.endsWith(".webp")
            );
        } catch (err) {
            gallery[folder] = [];
        }
    });
    res.json(gallery);
});
const db = new sqlite3.Database("./database.db", (err) => {
    if(err){
        console.log(err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});
db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        password TEXT,
        avatar TEXT DEFAULT 'images/default-avatar.png',
        reset_token TEXT,
        reset_token_expire INTEGER
    )
`);
db.run(`
    ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT 'images/default-avatar.png'
`, (err) => {
    if (err) {
        console.log("Avatar column already exists.");
    } else {
        console.log("Avatar column added.");
    }
});
db.run(`
    ALTER TABLE users ADD COLUMN reset_token TEXT
`, (err) => {
    if (err) {
        console.log("Reset token column already exists.");
    } else {
        console.log("Reset token column added.");
    }
});
db.run(`
    ALTER TABLE users ADD COLUMN reset_token_expire INTEGER
`, (err) => {
    if (err) {
        console.log("Reset token expire column already exists.");
    } else {
        console.log("Reset token expire column added.");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        city TEXT,
        state TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT
    )
`, (err) => {
    if(err){
        console.log(err.message);
        return;
    }
    console.log("Events table ready.");
    db.run(`
        INSERT OR REPLACE INTO events
        (id, name, city, state, start_date, end_date, description)
        VALUES
              (1, 'Rio Carnaval', 'Rio de Janeiro', 'Rio de Janeiro', '2026-02-13', '2026-02-18', 'One of the biggest carnival celebrations in the world.'),
              (2, 'São Paulo Carnaval', 'São Paulo', 'São Paulo', '2026-02-13', '2026-02-18', 'Large samba parades and street parties.'),
              (3, 'Salvador Carnaval', 'Salvador', 'Bahia', '2026-02-12', '2026-02-18', 'Massive street carnival with music trucks and dancing.'),
              (4, 'Recife & Olinda Carnaval', 'Recife', 'Pernambuco', '2026-02-13', '2026-02-18', 'Traditional carnival famous for Frevo music and giant puppets.'),
              (5, 'Lollapalooza Brazil', 'São Paulo', 'São Paulo', '2026-03-20', '2026-03-22', 'International music festival with global artists.'),
              (6, 'Holy Week Festival', 'Ouro Preto', 'Minas Gerais', '2026-04-02', '2026-04-05', 'Traditional Easter celebrations and religious processions.'),
              (7, 'Festa Junina', 'Campina Grande', 'Paraíba', '2026-06-01', '2026-06-30', 'Traditional Brazilian June festival with music, food and dancing.'),
              (8, 'Parintins Folklore Festival', 'Parintins', 'Amazonas', '2026-06-26', '2026-06-28', 'Famous folklore festival in the Amazon region.'),
              (9, 'Festival de Inverno', 'Campos do Jordão', 'São Paulo', '2026-07-04', '2026-07-26', 'Brazilian winter music and classical arts festival.'),
              (10, 'Rock in Rio', 'Rio de Janeiro', 'Rio de Janeiro', '2026-09-04', '2026-09-13', 'Major international music festival.'),
              (11, 'Círio de Nazaré', 'Belém', 'Pará', '2026-10-11', '2026-10-11', 'One of the largest religious festivals in Brazil.'),
              (12, 'Oktoberfest Blumenau', 'Blumenau', 'Santa Catarina', '2026-10-07', '2026-10-25', 'Brazilian Oktoberfest with German-Brazilian culture, music and food.'),
              (13, 'Festival do Boi-Bumbá', 'Manaus', 'Amazonas', '2026-11-01', '2026-11-03', 'Traditional Amazonian folklore celebration.'),
              (14, 'Réveillon Copacabana', 'Rio de Janeiro', 'Rio de Janeiro', '2026-12-31', '2027-01-01', 'Massive New Year celebration on Copacabana beach.')
              
    `, (err) => {
        if(err){
            console.log(err.message);
        } else {
            console.log("Events inserted.");
        }
    });
});
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login.html");
    }
    next();
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars");
    },
    filename: (req, file, cb) => {
        const fileName = "user-" + req.session.user.id + path.extname(file.originalname);
        cb(null, fileName);
    }
});
const upload = multer({
    storage: storage
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});
app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});
app.get("/gallery.html", (req, res) => {
    res.sendFile(path.join(__dirname, "gallery.html"));
});
app.get("/about.html", (req, res) => {
    res.sendFile(path.join(__dirname, "about.html"));
});
app.get("/states.html", (req, res) => {
    res.sendFile(path.join(__dirname, "states.html"));
});
app.get("/contact.html", (req, res) => {
    res.sendFile(path.join(__dirname, "contact.html"));
});
app.get("/account.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "account.html"));
});
app.get("/events.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "events.html"));
});
app.get("/forgot-password.html", (req, res) => {
    res.sendFile(path.join(__dirname, "forgot-password.html"));
});
app.get("/reset-password.html", (req, res) => {
    res.sendFile(path.join(__dirname, "reset-password.html"));
});
app.post("/register", async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users
            (first_name, last_name, email, phone, password)
            VALUES (?, ?, ?, ?, ?)`,
            [
                firstName,
                lastName,
                email,
                phone,
                hashedPassword
            ],
            function(err){
                if(err){
                    return res.status(400).json({
                        message: "User already exists"
                    });
                }
                res.json({
                    message: "Registration successful"
                });
            }
        );
    } catch(error){
        res.status(500).json({
            message: "Server error"
        });
    }
});
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
            if(err){
                return res.status(500).json({
                    message: "Server error"
                });
            }
            if(!user){
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );
            if(!passwordMatch){
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }
            req.session.user = {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatar: user.avatar
            };
            res.json({
                message: "Login successful",
                email: user.email,
                firstName: user.first_name,
                avatar: user.avatar,
                redirect: "index.html"
            });
        }
    );
});
app.get("/profile", (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            message: "Not logged in"
        });
    }
    db.get(
        "SELECT id, first_name, last_name, email, avatar FROM users WHERE id = ?",
        [req.session.user.id],
        (err, user) => {
            if (err || !user) {
                return res.status(500).json({
                    message: "Server error"
                });
            }
            res.json({
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatar: user.avatar
            });
        }
    );
});
app.post("/upload-avatar", requireLogin, upload.single("avatar"), (req, res) => {
    const avatarPath = "uploads/avatars/" + req.file.filename;
    db.run(
        "UPDATE users SET avatar = ? WHERE id = ?",
        [avatarPath, req.session.user.id],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Server error"
                });
            }
            req.session.user.avatar = avatarPath;
            res.redirect("/account.html");
        }
    );
});
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({
            message: "Logged out"
        });
    });
});
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, user) => {
            if(err){
                return res.status(500).json({
                    message: "Server error"
                });
            }
            if(!user){
                return res.json({
                    message: "If this email exists, reset link was created."
                });
            }
            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpire = Date.now() + 15 * 60 * 1000;
            db.run(
                "UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE email = ?",
                [resetToken, resetTokenExpire, email],
                (err) => {
                    if(err){
                        return res.status(500).json({
                            message: "Server error"
                        });
                    }
                    const resetLink = `http://localhost:${PORT}/reset-password.html?token=${resetToken}`;
                    console.log("RESET PASSWORD LINK:");
                    console.log(resetLink);
                    res.json({
                        message: "Reset link created. Check terminal."
                    });
                }
            );
        }
    );
});
app.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    db.get(
        "SELECT * FROM users WHERE reset_token = ? AND reset_token_expire > ?",
        [token, Date.now()],
        async (err, user) => {
            if(err){
                return res.status(500).json({
                    message: "Server error"
                });
            }
            if(!user){
                return res.status(400).json({
                    message: "Invalid or expired reset link"
                });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.run(
                `UPDATE users
                 SET password = ?,
                     reset_token = NULL,
                     reset_token_expire = NULL
                 WHERE id = ?`,
                [hashedPassword, user.id],
                (err) => {
                    if(err){
                        return res.status(500).json({
                            message: "Server error"
                        });
                    }
                    res.json({
                        message: "Password changed successfully"
                    });
                }
            );
        }
    );
});
app.get("/events-data", requireLogin, (req, res) => {
    db.all(
        "SELECT * FROM events ORDER BY start_date ASC",
        [],
        (err, rows) => {
            if(err){
                return res.status(500).json({
                    message: "Server error"
                });
            }
            res.json(rows);
        }
    );
});
app.get("/events-search", requireLogin, (req, res) => {
    const { from, to } = req.query;
    console.log("FROM:", from);
    console.log("TO:", to);

    db.all(
        `
        SELECT * FROM events
        WHERE date(start_date) <= date(?)
        AND date(end_date) >= date(?)
        ORDER BY start_date ASC
        `,
        [to, from],
        (err, rows) => {
            if(err){
                console.log(err.message);
                return res.status(500).json({
                    message: "Server error"
                });
            }

            console.log("FOUND EVENTS:", rows);

            res.json(rows);
        }
    );
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});