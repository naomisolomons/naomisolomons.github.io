function mix (){
  for(var i = 0; i < 25 ; i++){
    setTimeout(function(){
      edgeArray[0].changeweight(-0.01)
      edgeArray[2].changeweight(0.01)
      edgeArray[8].changeweight(0.01)
      edgeArray[10].changeweight(-0.01)
}, i*200);

}
}
