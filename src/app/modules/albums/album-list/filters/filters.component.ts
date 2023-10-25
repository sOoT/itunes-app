import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlbumsService } from '../../albums.service';
import { Artist } from 'src/app/models/artist.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ActivationStart, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/modules/shared/data-storage.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  artists: Artist[];
  albumSubscription: Subscription;
  routerSubscription: Subscription;
  selectedArtist: string;

  constructor(
    private albumsService: AlbumsService,
    private dataStorageService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route)
    this.routerSubscription = this.router.events.subscribe(data => {
      if (data instanceof ActivationStart) {
        this.selectedArtist = data.snapshot.params['artistId'];
        if (this.selectedArtist) {
          this.dataStorageService.fetchAlbumsByArtist(+this.selectedArtist).subscribe();
        }
      }
    });
    this.albumSubscription = this.albumsService.albumsChanged.subscribe(
      () => {
        this.artists = this.albumsService.getArtists();
      }
    );
  }

  onSelect(value: string) {
    this.router.navigate(['/albums/' + value]);
  }

  ngOnDestroy(): void {
    this.albumSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
