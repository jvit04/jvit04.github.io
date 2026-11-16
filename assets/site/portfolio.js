document.addEventListener('DOMContentLoaded',()=>{
  const menuButton=document.querySelector('.menu');
  if(menuButton) menuButton.addEventListener('click',()=>{
    const open=document.body.classList.toggle('mobile-open');
    menuButton.setAttribute('aria-expanded',String(open));
  });

  // Open project demos in an accessible overlay instead of navigating away.
  const dialog=document.createElement('dialog');
  dialog.className='media-dialog';
  dialog.setAttribute('aria-label','Project demonstration');
  dialog.innerHTML=`
    <div class="media-dialog__panel">
      <button class="media-dialog__close" type="button" aria-label="Close demonstration">×</button>
      <div class="media-dialog__content"></div>
      <p class="media-dialog__caption"></p>
    </div>`;
  document.body.appendChild(dialog);
  const content=dialog.querySelector('.media-dialog__content');
  const caption=dialog.querySelector('.media-dialog__caption');
  const closeButton=dialog.querySelector('.media-dialog__close');

  function closeDialog(){
    const video=content.querySelector('video');
    if(video) video.pause();
    dialog.close();
    content.replaceChildren();
    caption.textContent='';
  }
  closeButton.addEventListener('click',closeDialog);
  dialog.addEventListener('click',event=>{
    if(event.target===dialog) closeDialog();
  });
  dialog.addEventListener('close',()=>{
    const video=content.querySelector('video');
    if(video) video.pause();
  });

  document.addEventListener('click',event=>{
    const link=event.target.closest('a.card-media');
    if(!link) return;
    event.preventDefault();
    const source=link.getAttribute('href');
    if(!source) return;
    const isVideo=/\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(source);
    const media=isVideo?document.createElement('video'):document.createElement('img');
    media.className='media-dialog__media';
    media.src=source;
    if(isVideo){
      media.controls=true;
      media.playsInline=true;
      media.preload='metadata';
    }else{
      media.alt=link.querySelector('img')?.alt||'Project demonstration';
    }
    content.replaceChildren(media);
    caption.textContent=link.querySelector('img')?.alt||'';
    if(typeof dialog.showModal==='function') dialog.showModal();
    else dialog.setAttribute('open','');
    if(isVideo) media.play().catch(()=>{});
  });
});
