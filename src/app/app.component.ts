import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { loadStyles } from './helpers/_functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'price-calculator';
}
