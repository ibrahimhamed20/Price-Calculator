import { Component, OnInit } from '@angular/core';
import { loadStyles } from '@app/helpers/_functions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  changeLang(lang: 'en' | 'ar') {
    this.translate.use(lang);
    loadStyles(`assets/styles/${lang}_style.css`, 'cssStyle', lang);
  }

  ngOnInit() {
  }

}
