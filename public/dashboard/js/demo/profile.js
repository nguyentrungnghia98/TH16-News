$(document).ready(function() {
  $('#nav-info li:first-child a').tab('show')
  let _doms = document.querySelectorAll('.tab-info')
  _doms.forEach((el,index)=>{
    el.addEventListener("click",event=>{
      _doms.forEach(e => e.classList.remove("active"))
      el.classList.add("active")
    })
  })
})