import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Needed for NgForm
import { IonicModule } from '@ionic/angular'; // If you use Ionic components in 
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
@NgModule({
  declarations: [
    // Declare all components, directives, pipes that belong to this shared module
    ToolbarComponent,
    NotificationModalComponent,
    LoaderComponent
  ],
  imports: [
    // Import modules whose components/directives/pipes are used within this module's templates
    CommonModule, // For NgIf, NgFor etc.
    FormsModule ,
    IonicModule, 
    // If you use Angular Material or other libraries in these components, import them here too
    // e.g., MatDialogModule, MatFormFieldModule, MatInputModule etc.
  ],
  exports: [
    // Export components, directives, pipes that other modules will use
    ToolbarComponent,
    NotificationModalComponent,
    LoaderComponent,
    // Also re-export modules whose exports other modules will need
    CommonModule, // Often re-exported for convenience
    FormsModule,   // Often re-exported for convenience
    IonicModule // If you use Ionic components in the shared components
  ]
})
export class SharedModule { }