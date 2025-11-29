const upLoad = document.querySelector('.Upload');
const upbtn = document.querySelectorAll('.Up');
const delBtn = document.querySelectorAll('.Del');
const about = document.querySelector('.aboutbtn');
const modal = document.getElementById("parentModal");
const closebtn = document.querySelector('.close');
const ArtistInput = modal.querySelector('.input[name="artist"]');
const TitleInput = modal.querySelector('.input[name="title"]');
const staticArtist = document.querySelectorAll('.text2');
const staticTitle = document.querySelectorAll('.title');
const submitbtn = document.querySelector('.submit');
const form = document.getElementById('uploadForm');
const upDel = document.getElementById('upDelbtn');
const ham = document.querySelector(".hamburger")
const ul = document.querySelector(".ul");
const footer = document.querySelector('.foot');
console.log(upLoad);



let trackEle = null;
let currentTrackId = null;
let tracks = [];
let isOpen = false;
ham.addEventListener("click", ()=>{
    isOpen = !isOpen;

    if(isOpen){
        ul.style.visibility = "visible";
    }else{
        ul.style.visibility = "hidden";
    }
    

    

});



upLoad.addEventListener("click", ()=>{
    upbtn.forEach(e =>{
        e.style.visibility = "visible";
        
    });
    about.style.visibility="visible";
});

upbtn.forEach(btn => {
    btn.addEventListener("click", (e)=>{
         trackEle = e.target.closest(".container");
        const trackId = trackEle.dataset.id;
        
        modal.classList.add("show");


        closebtn.addEventListener("click", ()=>{
        modal.style.display = "none";
            
            inPut.forEach(input => {
                input.value = '';
            });
            
        });

});
 });


       form.addEventListener("submit", (e)=>{
        e.preventDefault();

        trackEle.querySelector('.text2').textContent = modal.querySelector('.input[name="artist"]').value;
        trackEle.querySelector('.title').textContent = modal.querySelector('.input[name="title"]').value;
        trackEle.querySelector('.imge').src = modal.querySelector('.but[name="cover"]').value;

        modal.style.display = "none";
        const updatedArtist = modal.querySelector('.input[name="artist"]').value;
        const upDatedTitle = modal.querySelector('.input[name="title"]').value;
        const trackId = trackEle.dataset.id;

        fetch(`http://localhost:5000/api/tracks/${trackId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                 'x-admin-token': 'YOUR_ADMIN_TOKEN'
                },
            body: JSON.stringify({
                title: upDatedTitle,
                artist: updatedArtist
            })

        })
        .then(res => res.json())
        .then(data => {console.log('Track updated on backend', data)

            trackEle.querySelector('.text2').textContent=updatedArtist;
            trackEle.querySelector('.title').textContent = upDatedTitle;

        modal.style.display = "none";
       })
        .catch(err => console.error('update failed'));
 });

 //BACKEND LOADING 
  async function fetchTrack(){

    try{
    const res = await fetch(`http://localhost:5000/api/tracks`);
    tracks =  await res.json();
   // console.log("Fetched tracks:", tracks);
    //console.log(tracks);

  //RENDER TRACKS
    const container = document.querySelector(".flex");
    container.innerHTML = "";

     tracks.forEach(track =>{
        //console.log('Fetched track audio path:', track.audioPath);
        const trackEl = document.createElement("div");
        trackEl.classList.add("container");
        trackEl.dataset.id = track.id;

        trackEl.innerHTML = `
         <div class="image">
                    <img class="imge"  src="${track.coverPath}"/>
                </div>
                <div class="text">
             <p> <span class="title">${track.title}</span></p>
                <p class="text2">${track.artist}</p>
                 <div class="medialine">
                        <hr>
                    <hr class="line">
                
                  <audio class="audio" src="${track.audioPath}" preload="metadata"></audio>
                    <div class="playbutton">
                    <i class="fa-solid fa-play"></i>                   
                </div>

                </div>
                </div>
                <div id="upDelbtn">
                <button class="Up" data-id="${track.id}">Update</button>
                </div>
        `;
        container.appendChild(trackEl);

        //Set video Player source fromthe first track that has a videoPath
       if(track.videoPath) {
        const videoPlayer = document.getElementById("videoPlayer");
        videoPlayer.src = track.videoPath;
        videoPlayer.load();
       }
         //UPLOAD BUTTON
            const upLoad = document.querySelector('.Upload');
            let manageMode = false;
            if (upLoad){
                upLoad.addEventListener("click", (e) =>{
                    e.stopPropagation();
                    manageMode = !manageMode;

                    document.querySelectorAll('.Up').forEach(but =>{
                        but.style.visibility = manageMode ? "visible" : "hidden";
                    });
                    console.log(manageMode ? "Manage Mode ON" : "Manage Mode OFF");
                });
            }
        const playBtn = trackEl.querySelector('.playbutton');
        const audio = trackEl.querySelector('.audio');
        const progressFill = trackEl.querySelector('.line');
        console.log(trackEl);

       document.addEventListener("click", (e)=>{
        const btn = e.target.closest(".playbutton");
        if (!btn) return;

        const trackEl = btn.closest('.container');
        if(!trackEl) return;

         const audio = trackEl.querySelector('.audio');
            if (!audio || !audio.src){
                alert("No audio souurce found!");
                return;
            }

            //PAUSE ALL OTHER TRACKS
            document.querySelectorAll(".audio").forEach(a =>{
                if (a !== audio){
                    a.pause();
                  const otherBtn = a.closest(".container")?.querySelector(".playbutton")
                  if(otherBtn) otherBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                }
            });
            
            //Toggle
            if (audio.paused){
                audio.play();
                    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';

            } else{
                audio.pause();
                btn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
            

        const titleEl = trackEl.querySelector(".title");
        const artistEl = trackEl.querySelector(".text2");
        const coverImg = container.querySelector(".img") || trackEl.querySelector('.imge');


        const NowTitleEl = document.getElementById("Nowtitle");
        const nowArtistEl = document.getElementById('Nowartist');
        const nowCoverEl = document.getElementById('Nowcover');

        if (NowTitleEl && titleEl) NowTitleEl.textContent = titleEl.textContent.trim();
        if (nowArtistEl && artistEl) nowArtistEl.textContent = artistEl.textContent.trim();
        if(nowCoverEl && coverImg) nowCoverEl.src = coverImg.src;




                //PROGRESSI BAR
                audio.addEventListener("timeupdate", ()=>{
                    if (!audio.duration) return;
                    const progress = (audio.currentTime / audio.duration) * 85;

                    const trackEl = btn.closest(".container");
                    const line = trackEl.querySelector(".line");
                    if (line){
                        line.style.width = progress + "%";
                    };
                })

                //Reset when song ends
                audio.addEventListener("ended", ()=>{
                    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
                    const line = btn.closest(".container").querySelector(".line");
                    if(line) line.style.width = "0%";
                });
       });



           
            
           

       //ATTACK SAME MODALS
        trackEl.querySelector('.Up').addEventListener("click", ()=>{
           editTrack(track.id, track.artist, track.title);
        });
        //console.log("Track info: track");

         });

    
         

  }catch (err) {
            console.error('error fetching tracks:', err);
            
         }

        };

  

   document.addEventListener("click", (e) =>{
                
                if (e.target.closest('.Up')){
                    const trackId = e.target.dataset.id;
                    console.log("Update clicked for track:", trackId);


                    modal.classList.add('show');
                    modal.dataset.trackId = trackId;

                    //console.log("modal element is:", modal);
                    //console.log("modal classes now:", modal);
                    

                    
                }
            })
            



  async function editTrack(id, artist, title) {
    const dynaModal = modal;
    const dynaForm = form;

    modal.style.display ="block";

    dynaForm.querySelector('[name="artist"]').value = artist;
    dynaForm.querySelector('[name="title"]').value = title;

    

    closebtn.addEventListener("click", ()=>{
        modal.style.display = "none";
    })

    dynaForm.onsubmit = async (e) =>{
        e.preventDefault();
        const title =  dynaForm.querySelector('[name="artist"]').value;
        const artist =  dynaForm.querySelector('[name="title"]').value;

        

        if(!title || !artist){
            alert('Please fill in both fields');
            return;
        }

        //FOR FORMDATA COVER FILES UPLOAD
        const coverFile = dynaForm.querySelector('[name="cover"]').files[0];
        const audioFile = dynaForm.querySelector('[name="audio"]').files[0];
        const videoFile = dynaForm.querySelector('[name = "video"]').files[0];

        const formData = new FormData();
        formData.append('artist', artist);
        formData.append('title', title);
        if (coverFile) formData.append('cover', coverFile);
        if(audioFile) formData.append('audio', audioFile);
        if (videoFile) formData.append('video', videoFile);

       
        try{
        const res = await fetch(`/api/tracks/${id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok){
            throw new Error("Network responsse was not okay");
        }
        const data = await res.json();
        console.log("Full backend response:", data);
        console.log("Updated video player with:", data.videoPath);
    

        //trackEl.querySelector(".text2").textContent = updatedArtist;
        //trackEl.querySelector(".title").textContent = upDatedTitle;
        
        // if video was uploaded update the top video player

        if (data.videoPath){
            const videoPlayer = document.getElementById("videoPlayer");
             videoPlayer.src = `http://localhost:5000${data.videoPath}`;
            videoPlayer.load();
            console.log("Video updated succesfully!");
        }else{
            console.warn("no videoPath returned from backend");
        }

         if(res.ok){
            const trackCard = document.querySelector(`[data-id="${id}"]`)
            if(trackCard){
                trackCard.querySelector('.text2').textContent = data.artist;
                trackCard.querySelector('.title').textContent = data.title;

                if(data.coverPath){
                    trackCard.querySelector('img').src = `http://localhost:5000${data.coverPath}?v=${Date.now()}`;

                }
            }

            dynaForm.reset();
            modal.style.display = "none";
            alert("Track updated succesfully!");

        }

        console.log("updated track:", data);
        dynaForm.reset();
        modal.style.display = "none";

        fetchTrack();
        

        }catch (err){
            console.error("Update failed:", err);
        }

    };
  }
  document.addEventListener("DOMContentLoaded", fetchTrack, editTrack);
