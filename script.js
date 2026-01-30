// TODO: add audio

// ACCESS HTML ELEMENTS
const dog_container = document.getElementById("dog-container");
const dog = document.querySelector(".dog");

// sound effect variables
const bark = document.getElementById("bark");
const pant = document.getElementById("pant");
const eat = document.getElementById("eat");

// upgrade variables
const points_dis = document.getElementById("pets");
let pets = 0;
let upgrade_cost = 10;
let boost = 5;
const boost_text = document.getElementById("boost-text");

// warning variables
const no_warnings = document.getElementById("no-warnings");
const sad_icon = document.getElementById("sad");
const hungry_icon = document.getElementById("hungry");
const sick_icon = document.getElementById("sick");
const dirty_icon = document.getElementById("dirty");
const tired_icon = document.getElementById("tired");
let active_icons = [];

// stat displays
const happy_dis = document.getElementById("happy-stat");
const hunger_dis = document.getElementById("hunger-stat");
const health_dis = document.getElementById("health-stat");
const clean_dis = document.getElementById("clean-stat");
const energy_dis = document.getElementById("energy-stat");

// get stat colors from CSS variables
const rootStyles = getComputedStyle(document.documentElement);
const happy = rootStyles.getPropertyValue('--happy').trim();
const sad = rootStyles.getPropertyValue('--sad').trim();
const hungry = rootStyles.getPropertyValue('--hungry').trim();
const sick = rootStyles.getPropertyValue('--sick').trim();
const dirty = rootStyles.getPropertyValue('--clean').trim();
const tired = rootStyles.getPropertyValue('--energy').trim();

// access buttons 
const play_btn = document.getElementById("play-btn");
const feed_btn = document.getElementById("feed-btn");
const sick_btn = document.getElementById("medicine-btn");
const clean_btn = document.getElementById("clean-btn");
const sleep_btn = document.getElementById("sleep-btn");
const upgrade_btn = document.getElementById("upgrade-btn");
const btns = [play_btn, feed_btn, sick_btn, clean_btn];

// initialize stats
let happy_stat = 100;
let hunger_stat = 0;
let health_stat = 100;
let clean_stat = 100;
let energy_stat = 100;

let colors_by_occurrance = []; // used to track which order background colors come, used for healing stats

window.onload = function() {
    if (localStorage.getItem("happy_stat") !== null) {
        // load and display stats
        happy_stat = localStorage.getItem("happy_stat");
        hunger_stat = localStorage.getItem("hunger_stat");
        health_stat = localStorage.getItem("health_stat");
        clean_stat = localStorage.getItem("clean_stat");
        energy_stat = localStorage.getItem("energy_stat");
        display_stats();

        // load and set background
        colors_by_occurrance = JSON.parse(localStorage.getItem("colors_by_occurrance")) || [];
        dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
    
        // load and display icons
        active_icons = JSON.parse(localStorage.getItem("active_icons")) || [];
        for (icon of active_icons) {
            icon.style.display = "block";
        }
    }
}

function display_stats() {
    happy_dis.innerText = "Happiness: " + happy_stat;
    hunger_dis.innerText = "Hunger: " + hunger_stat;
    health_dis.innerText = "Health: " + health_stat;
    clean_dis.innerText = "Cleanliness: " + clean_stat;
    energy_dis.innerText = "Energy: " + energy_stat;
}

// autosave data every 3s
const save = setInterval(function(){
    // save stats
    localStorage.setItem("happy_stat", happy_stat);
    localStorage.setItem("hunger_stat", hunger_stat);
    localStorage.setItem("health_stat", health_stat);
    localStorage.setItem("clean_stat", clean_stat);
    localStorage.setItem("energy_stat", energy_stat);

    // save bg colors
    localStorage.setItem("colors_by_occurrance", JSON.stringify(colors_by_occurrance));

    // save icons
    localStorage.setItem("active_icons", JSON.stringify(active_icons));
}, 3000);

// clear local storage for debugging
function reset() {
    happy_stat = 100;
    hunger_stat = 0;
    health_stat = 100;
    clean_stat = 100;
    energy_stat = 100;
    colors_by_occurrance = [];
    active_icons = [];
}

// happy stat will decrease every 3 seconds
const happy_interval = setInterval(function(){
    if (happy_stat > 0){
        happy_stat--;
        happy_dis.innerHTML = "Happiness: " + happy_stat;
    }
    if (happy_stat == 49) {
        colors_by_occurrance.push(sad);
        dog_container.style.background = sad;
        no_warnings.style.display = "none";
        sad_icon.style.display = "block";
        active_icons.push(sad_icon);
    }
}, 3000);

// hunger stat will increase every 2 seconds
const hunger_interval = setInterval(function(){
    if (hunger_stat < 100){
        hunger_stat++;
        hunger_dis.innerHTML = "Hunger: " + hunger_stat;
    }
    if (hunger_stat == 51) {
        colors_by_occurrance.push(hungry);
        dog_container.style.background = hungry;
        no_warnings.style.display = "none";
        hungry_icon.style.display = "block";
        active_icons.push(hungry_icon);
    }
}, 1000);

// health stat will decrease every 7 seconds
const health_interval = setInterval(function(){
    if (health_stat > 0){
        health_stat--;
        health_dis.innerHTML = "Health: " + health_stat;
    }
    if (health_stat == 49) {
        colors_by_occurrance.push(sick);
        dog_container.style.background = sick;
        no_warnings.style.display = "none";
        sick_icon.style.display = "block";
        active_icons.push(sick_icon);
    }
}, 7000);

// cleanliness stat will decrease every 5 seconds
const clean_interval = setInterval(function(){
    if (clean_stat > 0){
        clean_stat--;
        clean_dis.innerHTML = "Cleanliness: " + clean_stat;
    }
    if (clean_stat == 49) {
        colors_by_occurrance.push(dirty);
        dog_container.style.background = dirty;
        no_warnings.style.display = "none";
        dirty_icon.style.display = "block";
        active_icons.push(dirty_icon);
    }
}, 5000);

// energy stat will decrease every 2.5 seconds
const energy_interval = setInterval(function(){
    if (energy_stat > 0){
        energy_stat--;
        energy_dis.innerHTML = "Energy: " + energy_stat;
    }
    if (energy_stat == 49) {
        colors_by_occurrance.push(tired);
        dog_container.style.background = tired;
        no_warnings.style.display = "none";
        tired_icon.style.display = "block";
        active_icons.push(tired_icon);
    }
}, 2500);

// get 1 point every time you pet the dog
dog.onclick = function() {
    const bark_play = Math.floor(Math.random()*101);
    if (bark_play > 80) { // only bark sometimes
        bark.play();
    }
    pets++;
    points_dis.innerText = pets;
}

// checks if icon is hidden
function isHidden(el) {
    return getComputedStyle(el).display === "none";
}

// checks if all icons are disabled
// if they are, set the no warning text to block
function check_icons() {
    if (isHidden(sad_icon) && isHidden(hungry_icon) && isHidden(sick_icon) && isHidden(dirty_icon)){
        no_warnings.style.display = "block";
    }
}

// BUTTON FUNCTIONS
// disables button for 10s after click
function disable_btn(btn, time) {
    btn.disabled = true;
    setTimeout(function(){
        btn.disabled = false;
    }, time)
}

// play fetch
play_btn.onclick = function() {
    pant.play();
    happy_stat += boost;
    if (happy_stat > 100) { // max happy stat is 100
        happy_stat = 100;
    }
    happy_dis.innerHTML = "Happiness: " + happy_stat;

    if (happy_stat >= 50) {
        if (sad.includes(colors_by_occurrance)) {
            colors_by_occurrance.splice(colors_by_occurrance.indexOf(sad), 1);
        }
        if (colors_by_occurrance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
        }
        sad_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(sad_icon), 1);
        check_icons();
    }
    disable_btn(play_btn, 15000);
}

// feed dog
feed_btn.onclick = function() {
    eat.play();
    setTimeout(function(){
        eat.pause();
        eat.currentTime = 0;
    }, 5000);

    hunger_stat -= boost;
    if (hunger_stat < 0) { // max happy stat is 100
        hunger_stat = 0;
    }
    hunger_dis.innerHTML = "Hunger: " + hunger_stat;

    if (hunger_stat <= 51) {
        if (hungry.includes(colors_by_occurrance)) {
            colors_by_occurrance.splice(colors_by_occurrance.indexOf(hungry), 1);
        }
        if (colors_by_occurrance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
        }
        hungry_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(hungry_icon), 1);
        check_icons();
    }
    disable_btn(feed_btn, 10000);
}

// give dog medicine
sick_btn.onclick = function() {
    bark.play();
    health_stat += boost;
    if (health_stat > 100) { // max happy stat is 100
        health_stat = 100;
    }
    health_dis.innerHTML = "Health: " + health_stat;

    if (health_stat >= 50) {
        if (sick.includes(colors_by_occurrance)) {
            colors_by_occurrance.splice(colors_by_occurrance.indexOf(sick), 1);
        }
        if (colors_by_occurrance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
        }
        sick_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(sick_icon), 1);
        check_icons();
    }
    disable_btn(sick_btn, 35000);
}

// give dog a bath
clean_btn.onclick = function() {
    clean_stat += boost;
    if (clean_stat > 100) { // max happy stat is 100
        clean_stat = 100;
    }
    clean_dis.innerHTML = "Cleanliness: " + clean_stat;

    if (clean_stat >= 50) {
        if (dirty.includes(colors_by_occurrance)) {
            colors_by_occurrance.splice(colors_by_occurrance.indexOf(dirty), 1);
        }
        if (colors_by_occurrance.length == 0) {
            dog_container.style.background = happy;
        } else {
            dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
        }
        dirty_icon.style.display = "none";
        active_icons.splice(active_icons.indexOf(dirty_icon), 1);
        check_icons();
    }
    disable_btn(clean_btn, 25000);
}

// disables all buttons for 10s
function disable_btns() {
    for (btn of btns) {
        disable_btn(btn, 10000);
    }
}

// put dog to sleep
sleep_btn.onclick = function() {
    dog.src = "images/sleep.png";
    document.body.style.background = "#8888FF";
    energy_stat = 100;
    energy_dis.innerHTML = "Energy: 100";
    disable_btn(sleep_btn, 30000);
    disable_btns();

    setTimeout(function(){ // dog wakes up after 10s
        dog.src = "images/dog.png";
        document.body.style.background = "#eff7ff";
        if (energy_stat >= 50) {
            if (tired.includes(colors_by_occurrance)) {
                colors_by_occurrance.splice(colors_by_occurrance.indexOf(tired), 1);
            }
            if (colors_by_occurrance.length == 0) {
                dog_container.style.background = happy;
            } else {
                dog_container.style.background = colors_by_occurrance[colors_by_occurrance.length-1];
            }
            tired_icon.style.display = "none";
            active_icons.splice(active_icons.indexOf(tired_icon), 1);
            check_icons();
        }
    }, 10000);
}

// upgrades boost
upgrade_btn.onclick = function() {
    if ((pets >= upgrade_cost) && (boost <= 50)) {
        pets -= upgrade_cost;
        points_dis.innerText = pets;

        boost++;
        boost_text.innerHTML = "Boost: " + boost;

        upgrade_cost += 5;
        upgrade_btn.innerHTML = "Upgrade - " + upgrade_cost + " &#9995;";
    }
    if (boost >= 50) {
        upgrade_btn.disabled = true;
    }
}