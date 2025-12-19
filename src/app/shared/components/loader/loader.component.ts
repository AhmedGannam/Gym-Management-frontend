import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: false
})
export class LoaderComponent {
  @Input() message: string = 'Loading...';
  @Input() progress: number | null = null; // null = indeterminate
} 