var myObject = [ { _id: 5aaa7016086ce427f0f10518,
    uid: 'akamitdhn@gmail.com',
    registrationNumber: '0000000',
    vehicleNumber: '00000000',
    ownerName: '0000000',
    yearOfPurchase: '2000',
    PUCDate: 2000-02-20T00:00:00.000Z,
    __v: 0 },
  { _id: 5aab604b1822be2cd0c397a6,
    uid: 'akamitdhn@gmail.com',
    registrationNumber: '2398479',
    vehicleNumber: '54os523',
    ownerName: 'kkm',
    yearOfPurchase: '2000',
    PUCDate: 2006-06-12T00:00:00.000Z,
    __v: 0 } ];
var select = document.getElementById('example-select');
for(index in myObject)
{
  select.options[select.options.length] = new Option(myObject[index], index); 
}



<select id = "example-select"></select>