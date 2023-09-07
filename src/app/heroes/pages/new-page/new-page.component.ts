import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:        new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Si el url incluye la palabra edit, se quiere crear un nuevo recurso
    if( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ))
      ).subscribe( hero => {
        // Si no hay heroe con ese id regresa al usuario a la ruta /
        if(!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset( hero );
        return;
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    // Si el formulario no es valido
    if( !this.heroForm.valid ) return;

    // Si el heroe viene con id, quiere actualizar
    if( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackBar(`${ hero.superhero } updated!`)
        });

        return;
    }

    // Sino quiere crear
    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        //TODO: mostrar snackbar, y navegar a heroes/edit/hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${ hero.superhero } created!`);
      });
  }

  onDeleteHero() {
    if( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().subscribe(result => {
     if( !result ) return;

     this.heroesService.deleteHeroById( this.currentHero.id )
      .subscribe( wasDeleted => {
        if( wasDeleted )
          this.router.navigate(['/heroes']);
      })
    });
  
  }

  showSnackBar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500
    });
  }

}
