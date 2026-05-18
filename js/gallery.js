fetch("/gallery-images")
.then(res => res.json())
.then(gallery => {
    for(let region in gallery){
        const container =
        document.getElementById(region);
        if(!container) continue;
        gallery[region].forEach(img => {
            container.innerHTML += `
            <div class="gallery-item">
                <img src="/images/gallery/${region}/${img}" 
                     alt="${region}">
            </div>
            `;
        });
    }
    addLightbox();
})
.catch(err=>{
    console.log("Gallery loading error:",err);
});
function addLightbox(){
    const images =
    document.querySelectorAll(".gallery-item img");
    images.forEach(image=>{
        image.addEventListener("click",()=>{
            lightbox.style.display="flex";
            lightboxImg.src=image.src;
            document.body.style.overflow="hidden";
        });
    });
}
const lightbox =
document.querySelector(".lightbox");
const lightboxImg =
document.querySelector(".lightbox-img");
const closeBtn =
document.querySelector(".close-btn");
closeBtn.addEventListener(
"click",
closeLightbox
);
lightbox.addEventListener("click",(e)=>{
    if(e.target !== lightboxImg){
       closeLightbox();
    }
});
document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        closeLightbox();
    }
});
function closeLightbox(){
    lightbox.style.display="none";
    document.body.style.overflow="auto";
}