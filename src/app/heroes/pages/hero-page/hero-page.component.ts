import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  // Cuando se monte el componente,
  // leer el id de la ruta usando el activatedRoute, te suscribes y usas el pipe
  // switchMap para retornar el valor de otro observable usando el id que recibe como param
  // sino obtenemos hero retorna a la lista, sino retorna el hero


  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById(id))
      ).subscribe( hero => {
        if(!hero) return this.router.navigate(['/heroes/list']);

        this.hero = hero;
        return;
      });
  }

  goBack():void {
    this.router.navigateByUrl('heroes/list');
  }

}
