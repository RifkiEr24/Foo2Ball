import {
  getLeague,
  getUpcomingMatch,
  getRecentMatch,
  getLeagueById,
  getTopScorerById,
  getClubById
} from "./api.js";
document.addEventListener("DOMContentLoaded", function () {
  // Activate sidebar nav
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;
   
        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });
   
        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            // Tutup sidenav
            var sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
   
            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "src/nav.html", true);
    xhttp.send();
  }

  // LOAD PAGE CONTENT 

  let page = window.location.hash.substr(1);
  let path = window.location.pathname.substr(1);
  if (path === "") {
    path = "index.html";
  }

  if (path === "index.html") {
    if (page === "") {
      page = "home";
    }
    loadPage(page);
  } else if (path === "league.html") {
    getLeagueById();
    getTopScorerById();
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el);
  }else if(path == "club.html"){
    getClubById();
  }
  


  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          devbutton();
          if (page === "leaguelist") {
            league();
          } else if (page == "matches") {
            matches();
          } else if (page == "home") {
            home();
          }
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman Tidak Ditemukan</p>";
        } else {
          content.innerHTML = "<p>ups..Halaman tidak dapat diakses.</p>"
        }
      }

    }

    xhttp.open("GET", "/src/pages/" + page + ".html", true);
    xhttp.send();
  };


  function home() {
    getLeague();
    getUpcomingMatch();
    getRecentMatch();
    var elems = document.querySelectorAll('.carousel');
    M.Carousel.init(elems, {
      dist: 20,
      padding: 200,
      indicators: true,
    });
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el);
  }

  function league() {
    getLeague();
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el);


  }

  function matches() {
    getUpcomingMatch();
    getRecentMatch();
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el);
  }
});


function devbutton() {
  const devbutton = document.querySelectorAll(".development").forEach(devbutton => {
    devbutton.setAttribute("onclick", "M.toast({html: 'This Feature is not available yet because this app is still  under development'})");
  });
}