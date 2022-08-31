const util = require('util')
const router = require('express').Router();
const passport = require('passport');
const { fork } = require('child_process')

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/signin',
  failureRedirect: '/failuser',
  failureFlash: true
}));

router.get('/signin', (req, res, next) => {
  res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/faillogin',
  failureFlash: true
}));

router.get('/profile', isAuthenticated, (req, res, next) => {
  res.render('profile');
});
router.get('/failuser', (req, res) => {
  res.render('errorUser')
})
router.get('/faillogin', (req, res) => {
  res.render('errorLogin')
})
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/signin');
});

//RUTAS NUEVAS
router.get('/info', (req, res) => {
  /*
  const mensaje = {
    VersionNode: process.version,
    PathEjecucion: process.cwd(),
    IdProcess: process.pid,
    NombrePlataforma: process.platform,
    carpeta: process.title,
    UsodelaMemoria: util.inspect(process.memoryUsage(), {
      showHidden: false,
      depth: null,
      colors: true
    })
  }
*/



  res.json(`
  Version de Node ${process.version}
  Path de ejecucion ${process.cwd()}
  IdProcess ${process.pid}
  Nombre de la Plataforma ${process.platform}
  Carpeta ${process.title}
  path ${process.execPath}
  Uso de la Memoria ${util.inspect(process.memoryUsage(), {
    showHidden: false,
    depth: null,
    colors: true
  })}  
  
  
  `)

})



router.get('/api/randoms', (req, res) => {
  try {
    let cant = req.query.cant;

    if (!cant) {
      cant = 1e8
    }

    const forked = fork('src/api/numberRandom.js');

    forked.on('message', (result) => {
      if (result === 'enviado') {
        forked.send(cant);
      } else {

        res.status(200).json({ resultado: result });
      }
    });
  } catch (err) {
    console.log(err);
  }
})



function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/signin')
}

module.exports = router;