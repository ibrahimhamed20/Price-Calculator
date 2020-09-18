import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProduct } from '@app/interfaces/product';

@Component({
  selector: 'price-calculator',
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.scss']
})
export class PriceCalculatorComponent implements OnInit {
  productsList: IProduct[] = [];
  productForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.initProductForm();
  }

  initProductForm() {
    this.productForm = this._fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      itemUrl: ['', Validators.required],
      price: ['', Validators.compose([Validators.required, Validators.min(0)])],
      category: ['', Validators.required],
      color: [''],
      weight: ['', Validators.compose([Validators.required, Validators.min(0)])]
    });
  }

  get product() { return this.productForm.controls; }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    let productData = this.productForm.value as IProduct;

    this.productsList.push({
      ...productData,
      id: this.productsList.length + 1,
      quantity: 1
    });

    document.getElementById('addItem').click();
  }

}
