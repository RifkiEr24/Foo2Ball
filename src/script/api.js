const base_url="https://api.football-data.org";

function status(response){
    if(response.status !== 200){
        console.log(`Error ${response.status}`);
        return Promise.reject(new Error(response.statusText));
    }else{
        return Promise.resolve(response);
    }
}

function json(response){
    return response.json();
}
function error(error){
    console.log(`Error:${error}`);
}

function getLeague(){
    fetch(`${base_url}/v2/competitions?plan=TIER_ONE&areas=2163,2114,2224,2072`,{
        headers:{
            'X-Auth-Token':'1e1eb973f19444009adb6dfd3842f1a2',
            'Connection':'keep-alive'
        }
    })
    .then(status)
    .then(json)
    .then(function(data) {
    renderLeague(data);
  })
}

const renderLeague = data =>{
      let leagueHTML = "";
      data.competitions.forEach(league => {
        leagueHTML += `
        <a href="./league.html?id=${league.id}" class="collection-item avatar z-depth-1" style="border-radius:35px; margin:20px;">
        <img src="${league.area.ensignUrl}" alt="" class="circle">
        <span class="title"><b>${league.name}</b></span>
        <p>${league.area.name}<br>
           Total Matchday = ${league.currentSeason.currentMatchday}
        </p>
      
      </a>
            `;
      });
      document.getElementById("league").innerHTML = leagueHTML;
}

function getLeagueById(){
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    fetch(`${base_url}/v2/competitions/${idParam}/standings?standingType=TOTAL`,{
        headers:{
            'X-Auth-Token':'1e1eb973f19444009adb6dfd3842f1a2',
            'Connection':'keep-alive'
        }
    })
    .then(status)
    .then(json)
    .then(function(data) {
        renderLeagueById(data);
  })

}

const renderLeagueById = data => {
      let leagueHTML = "";
      console.log(data);
      document.getElementById("leaguename").innerHTML=data.competition.name;
      document.getElementById("leaguearea").innerHTML=data.competition.area.name;
      if(data.competition.id==2001){
        data.standings.forEach(league => {
            leagueHTML+=`   <h5 class="center-align">${league.group}</h5>`
            league.table.forEach(teams => {
               let crest=teams.team.crestUrl || "../../assets/img/notfound.jpg";
                leagueHTML += `
                <a href="./club.html?id=${teams.team.id}" class="collection-item avatar z-depth-1" style="border-radius:35px; margin:20px;">
                <img src="${crest}" alt="" class="circle">
                <span class="title"><b>${teams.position}.${teams.team.name}</b></span>
                <p><span class="green-text">${teams.won} W</span>/ <span class="grey-text">${teams.draw} D</span>/ <span class="red-text">${teams.lost} L</span><br>
                   <b>${teams.points} Points</b>
                </p>
          
              </a>
                    `;
            })
           
        })
      }else{
       data.standings[0].table.forEach(league => {
        let crest=league.team.crestUrl || "../../src/assets/img/notfound.jpg";
        leagueHTML += `
        <a href="./club.html?id=${league.team.id}" class="collection-item avatar z-depth-1" style="border-radius:35px; margin:20px;">
        <img src="${crest}" alt="" class="circle">
        <span class="title"><b>${league.position}.${league.team.name}</b></span>
        <p><span class="green-text">${league.won} W</span>/ <span class="grey-text">${league.draw} D</span>/ <span class="red-text">${league.lost} L</span><br>
           <b>${league.points} Points</b>
        </p>
  
      </a>
            `;
      });
    }
 
      document.getElementById("standing").innerHTML = leagueHTML;
}

function getTopScorerById(){
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    fetch(`${base_url}/v2/competitions/${idParam}/scorers`,{
        headers:{
            'X-Auth-Token':'1e1eb973f19444009adb6dfd3842f1a2',
            'Connection':'keep-alive'
        }
    })
    .then(status)
    .then(json)
    .then(function(data) {
     renderTopScorerById(data);
  })
}

const renderTopScorerById = data =>{
    let scorersHTML = "";
    data.scorers.forEach(scorer => {
     scorersHTML += `
     <a href="./player.html?id=${scorer.player.id}" class="collection-item avatar z-depth-1" style="border-radius:35px; margin:20px;">
     <img src="../../src/assets/img/unknown.jpg" alt="" class="circle">
     <span class="title"><b>${scorer.player.name}</b></span>
     <p>${scorer.team.name}<br>
        <b>${scorer.numberOfGoals} Goal</b>
     </p>

   </a>
         `;
   });
   document.getElementById("topscorer").innerHTML = scorersHTML;
}

function getClubById(){
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    fetch(`${base_url}/v2/teams/${idParam}`,{
        headers:{
            'X-Auth-Token':'1e1eb973f19444009adb6dfd3842f1a2',
            'Connection':'keep-alive'
        }
    })
    .then(status)
    .then(json)
    .then( data => {
    renderClubByID(data);
  })
}

const renderClubByID = data =>{
     // Objek/array JavaScript dari response.json() masuk lewat data.
     document.getElementById("club").innerHTML=data.name;
     document.getElementById("clubarea").innerHTML=data.area.name;
     let crest=data.crestUrl || "../../src/assets/img/notfound.jpg";
     let address=data.address;
      let clubHTML = "";
      let playerHTML="";
      let mapiframe=`  <iframe width='100%' height='350' frameborder='0'  
      scrolling='no' marginheight='0' marginwidth='0'    
      src='https://maps.google.com/maps?&amp;q=   
      ${encodeURIComponent(address)}  
      &amp;output=embed'></iframe>`;
      let competition="";
        data.activeCompetitions.forEach(compe => {
            if(compe.plan=="TIER_ONE"){
                competition+=` <a href="./league.html?id=${compe.id}" class="chip ${compe.code}">
                ${compe.name} 
               </a>
   `
            }
           
        })
        data.squad.forEach(player => {
            let position="";
            if(player.position==null){
                position="Coach"
            }else{
                position=player.position;
            }
            playerHTML+=`
            <tr>
             <td>${player.name}</td>
             <td>${player.countryOfBirth}</td>
             <td><span  class=" white-text badge ${position}">${position}</span</td>
            </tr>`
        })
    //    data.scorers.forEach(scorer => {
        clubHTML += `
        <div class="row">
             <div class="col m4 s12">
               <img class="center responsive-img" style="padding: 3rem;"  src="${crest}">
             </div>
             <div class="col m4 s6 ">
                <p><b>Name:</b></p>
                <p>${data.name}</p>
                <p><b>Area:</b></p>
                <p>${data.area.name}</p>
                <p><b>Founded:</b></p>
                <p>${data.founded}</p>
                <p><b>Phone:</b></p>
                <p>${data.phone}</p>
              </div>
              <div class="col m4 s6 break-word">
                <p><b>Colors:</b></p>
                <p>${data.clubColors}</p>
                <p><b>Email:</b></p>
                <p>${data.email}</p>
                <p><b>Website:</b></p>
                <a class="website" href="${data.website}">${data.website}</a>
                <p><b>Venue:</b></p>
                <p>${data.venue}</p>
              </div>
         </div>
         <h6 class="center-align"><b>Currently Active Competition</b></h6>
        ${competition}
         <h6 class="center-align"><b>Address</b></h6>
        ${mapiframe}
        <h6 class="center-align"><b> Player List </b></h6>
        <table style="margin-bottom:40px">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Position</th>
                </tr>
              </thead>
              <tbody>
                ${playerHTML}
              </tbody>      
        </table>
            `;
      document.getElementById("clubcontent").innerHTML = clubHTML;
}

function getUpcomingMatch(){
    fetch(`${base_url}/v2/matches?status=SCHEDULED`,{
        headers:{
            'X-Auth-Token':'1e1eb973f19444009adb6dfd3842f1a2',
            'Connection':'keep-alive'
        }
    })
    .then(status)
    .then(json)
    .then( data => {
     renderUpcomingMatch(data);
  })
}

const renderUpcomingMatch = data =>{
    let leagueHTML = "";
    data.matches.forEach(league => {
      leagueHTML += `
      <li class="collection-item avatar z-depth-1" style="border-radius:35px; margin:20px;">
      <img src="${league.competition.area.ensignUrl}" alt="" class="circle">
      <a href="./league.html?id=${league.competition.id}"><span class="title"><b>${league.competition.name}</b></span></a>
      <p><a href="./club.html?id=${league.homeTeam.id}"><b>${league.homeTeam.name}</b></a> VS <a href="./club.html?id=${league.awayTeam.id}"><b> ${league.awayTeam.name}</b></a><br>
          ${league.group}
      </p>

    </li>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("upcomingmatch").innerHTML = leagueHTML;
}

function getRecentMatch(){
    fetch(`${base_url}/v2/matches?status=FINISHED&dateFrom=2020-07-14&dateTo=2020-07-19`,{
        headers:{
            'X-Auth-Token':'1e1eb973f19444009adb6dfd3842f1a2',
            'Connection':'keep-alive'
        }
    })
    .then(status)
    .then(json)
    .then( data => {
     renderRecentMatch(data);
  })
}
const renderRecentMatch =(data) => {

    let leagueHTML = "";
    data.matches.slice(-20).forEach(league => {
      leagueHTML += `
      <div class="col m4 s12">
          <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator" src="${league.competition.area.ensignUrl}">
              </div>
              <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">${league.competition.name}<i
                          class="material-icons right">more_vert</i></span>
                  <p class="center-align"><b>${league.homeTeam.name}</b> <br>
                      VS<br>
                      <b>${league.awayTeam.name}</b></p>
              </div>
              <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">Match Detail<i
                          class="material-icons right">close</i></span>
                          <!-- TEAM NAME -->
                  <div class="row">
                      <div class="col m6 s6">
                          <p class="center-align">${league.homeTeam.name}</p>
                      </div>
                      <div class="col m6 s6">
                          <p class="center-align">   ${league.awayTeam.name}</p>
                      </div>
                  </div>
                  <!-- HALFTIME -->
                  <div class="row">
                      <div class="col m12 s12">
                          <p class="center-align"><b>Half Time</b></p>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col m6 s6">
                         <p class="center-align"> ${league.score.halfTime.homeTeam}</p>
                      </div>
                      <div class="col m6 s6">
                          <p class="center-align">${league.score.halfTime.awayTeam}</p>
                      </div>
                  </div>
                  <!-- FULLTIME -->
                  <div class="row">
                      <div class="col m12 s12">
                          <p class="center-align"><b>Full Time</b></p>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col m6 s6">
                          <p class="center-align">   ${league.score.fullTime.homeTeam}</p>
                      </div>
                      <div class="col m6 s6">
                          <p class="center-align">    ${league.score.fullTime.awayTeam}</p>
                      </div>
                  </div>
              </div>
          </div>

      </div>
          `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("recentmatch").innerHTML = leagueHTML;
}
export{
    getLeague,
    getUpcomingMatch,
    getRecentMatch,
    getLeagueById,
    getTopScorerById,
    getClubById
};