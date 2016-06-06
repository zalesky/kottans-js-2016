/**
 * Validates a bank card
 * @param  {!String}  n number of card
 * @return {!Boolean} if card is valid then true
 */
function validate(n){
  var arr=n.split('').map(Number);
  var sum=0;
  var map={5:1,6:3,7:5,8:7,9:9};
  var len=arr.length;
  var i=len%2==0?0:1;

  for (;i<len;i+=2){
    arr[i]=map[arr[i]]||arr[i]*2;
  }

  for(;len;){
    sum+=arr[--len];
  }

  return sum%10===0
}
