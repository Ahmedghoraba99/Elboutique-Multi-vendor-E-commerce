export interface Tag {
  success:boolean,
  data: Data[]
}

interface Data{
  id:number,
  name:string,
  selected:boolean
}


export interface ITag{
  name:string,
  id:number
}


