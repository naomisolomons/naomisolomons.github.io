function mix (){
  for(var i = 0; i < 25 ; i++){
    setTimeout(function(){
      edgeArray[4].changeweight(-0.01)
      edgeArray[1].changeweight(0.01)

      edgeArray[13].changeweight(-0.01)
      edgeArray[7].changeweight(0.01)

      edgeArray[3].changeweight(-0.01)
      edgeArray[12].changeweight(0.01)
}, i*200);
  }

}
