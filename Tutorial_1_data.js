function mix (){
  for(var i = 0; i < 25 ; i++){
    setTimeout(function(){
      edgeArray[0].changeweight(-0.02)
      edgeArray[1].changeweight(0.02)
      edgeArray[2].changeweight(0.02)
      edgeArray[3].changeweight(-0.02)
}, i*200);

}
}
