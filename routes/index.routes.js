const express = require('express'); 
const router = express.Router();    

const cfdata = require('../demodata')

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/course', (req,res) => {
    res.render('course');
});

router.get('/about',(req,res) => {
    res.render('about');
});



router.get('/contact',(req,res) => {    
    res.render('contact');
});

router.get('/current-affairs',(req,res) => {    
    res.render('event',{data : cfdata});
});



router.get('/forgot-password',(req,res) => {
    res.render('forgot-password');
});

router.get('/teacher-profile',(req,res) => {
    res.render('teacher-profile');
});

router.get('/team',(req,res) => {
    res.render('team');
});

router.get('/become-a-teacher',(req,res) => {
    res.render('become-a-teacher');
});

router.get('/course-details',(req,res) => {
    res.render('course-details');
});

router.get('/open-test',(req,res) => {
    // res.render('open-test');
    res.send("Open Test");
});

module.exports = router;