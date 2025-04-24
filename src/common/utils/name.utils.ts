export const nameRegex =
  /^$|^(?!\s+$)[A-Za-zÀÁÃẢẠÂẦẤẪẨẬĂẮẰẴẲẶĐÉÈẼẺẸÊẾỀỄỂỆÍÌĨỈỊÓÒÕỌÔỐỒỖỔỘƠỚỜỠỞỢÊẾỀỄỂỆÚÙŨỦỤƯỨỪỮỬỰÝỲỸỶỴàáãảạâầấẩậăắằẵẳặđéèẽẻẹêếềễểệíìĩỉịóòõỏọôốồỗổộơớờỡởợêếềễểệúùũủụưứừữửựýỳỹỷỵ\s]+$/;

export const uppercaseFirstLetter = (name: string) =>
  name.charAt(0).toLocaleUpperCase() + name.slice(1).toLocaleLowerCase();
