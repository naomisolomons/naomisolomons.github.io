function mix (){
  for(var i = 0; i < 25 ; i++){
    setTimeout(function(){
      edgeArray[5].changeweight(-0.01)
      edgeArray[4].changeweight(0.01)

      edgeArray[0].changeweight(-0.01)
      edgeArray[1].changeweight(0.01)

}, i*200);
  }
  setTimeout(function(){
    for(var i = 0; i < 25 ; i++){
      setTimeout(function(){
        edgeArray[0].changeweight(0.01)
        edgeArray[3].changeweight(-0.01)

        edgeArray[12].changeweight(-0.01)
        edgeArray[15].changeweight(0.01)

  }, i*200);
}
}, 5000);

}
