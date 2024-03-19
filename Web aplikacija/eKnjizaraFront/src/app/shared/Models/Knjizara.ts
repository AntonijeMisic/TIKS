import { Knjiga } from "./Knjiga"

export interface Knjizara{
    id: number,
    naziv: string
    adresa: string,
    telefon: string,
    email: string,
    slika: string,
    knjige: Knjiga[]
}