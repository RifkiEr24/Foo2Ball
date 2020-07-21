function main() {
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();
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
    } else if (path == "club.html") {
        getClubById();
    }
}
