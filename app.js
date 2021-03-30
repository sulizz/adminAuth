import express from "express";

//imports for chat
import iplocate from "node-iplocate";
import publicIP from "public-ip";
import { default as fetch } from "node-fetch";
import { LocalStorage } from "node-localstorage";
import cors from "cors";
import http from "http";
import socketIO from "socket.io";

//constants declared
const app = express();
let localstorage = new LocalStorage("./Scratch");

app.set("port", 4000);

//admin imports
const db = require("./db");
const AdminController = require("./admin/AdminController");
app.use("/admin", AdminController);


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const session = require("express-session");
app.use(
    session({
        secret: "edurekaSecret",
        resave: false,
        saveUninitialized: true,
    })
);

app.set("view engine", "ejs");
app.set("views", "./views");

let sess;

const NewsList = require("./models/News_model");

app.get("/", (req, res) => {
    sess = req.session;
    sess.email = " ";

    res.render("signin", {
        invalid: req.query.invalid ? req.query.invalid : "",
        msg: req.query.msg ? req.query.msg : "",
    });
});

app.get("/top-news", (req, res) => {
    NewsList.find({}, (err, users) => {
        if (err) res.status(500).send(err);
        res.status(200).send(users);
    }).limit(3);
});


let server = http.createServer(app).listen(app.get("port"), () => {
    console.log("express app is up on ", app.get("port"));
});

let io = socketIO(server, {
    cors: {
        origins: ["http://localhost:4200"],
    },
});

io.sockets.on("connection", (socket) => {
    console.log("a user connected (socket)");
    var city;

    let list = socket.client.conn.server.clients;
    let users = Object.keys(list);

    //consuming my events with labels
    socket.on("nick", (nick) => {
        socket.nickname = nick;

        //console.log(users)
        socket.emit("userList", users);
    });

    socket.on("chat", (data) => {
        publicIP.v4().then((ip) => {
            iplocate(ip).then((results) => {
                var city = JSON.stringify(results.city, null, 2);
                localstorage.setItem("userLocal", city);
                //console.log('city: ',city)
            });
        });

        if (socket.nickname) {
            let nickname = socket.nickname;
            let curDate = new Date().toLocaleTimeString();
            let payload = {
                message: data,
                nick: nickname,
                date: curDate,
                location: localstorage.getItem("userLocal"),
                //location:city
            };

            console.log("payload: ", payload);
            //socket.emit('userList',users)
            //socket.emit('chat',payload)
            socket.broadcast.emit("chat", payload);
        }
    });
});

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.get("/", (req, res) => {
    res.send("<h1>Hey Socket.io</h1>");
});

app.get("/weather", cors(corsOptions), (err, response) => {
    publicIP.v4().then((ip) => {
        iplocate(ip).then((results) => {
            let city = results.city;
            let country = results.country_code;

            let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=e89bbf79ee4c5ca05e9ba54a351cb0b5`;
            fetch(url, { method: "GET" })
                .then((res) => res.json())
                .then((json) => {
                    //console.log(json)
                    response.send(json);
                })
                .catch((err) => {
                    throw err;
                });
        });
    });
});

