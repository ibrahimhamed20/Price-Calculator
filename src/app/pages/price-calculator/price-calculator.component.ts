import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { calculateSumByKey } from '@app/helpers/_functions';
import { IProduct } from '@app/interfaces/product';

@Component({
  selector: 'price-calculator',
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.scss']
})
export class PriceCalculatorComponent implements OnInit {
  productsList: IProduct[] = [];
  productForm: FormGroup;

  // properties
  companyFees: number = 0;
  shippingFees: number = 0;
  totalPrice: number = 0;
  totalDiscount: number = 0;
  customFees: number = 0;
  totalPriceAfterDiscount: number = 0;
  finalPrice: number = 0;

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

    if (productData && productData.id > 0) {
      let indx = this.productsList.findIndex(el => el.id == productData.id);
      this.productsList[indx] = {
        ...productData,
        price: +productData.price,
        totalPrice: this.productsList[indx].quantity * +productData.price,
        quantity: this.productsList[indx].quantity,
        discount: this.productsList[indx].discount,
        totalAfterDiscount: this.productsList[indx].discount > 0 ? this.productsList[indx].totalAfterDiscount : this.productsList[indx].quantity * +productData.price
      }
    } else {
      this.productsList.push({
        ...productData,
        price: +productData.price,
        id: this.productsList.length + 1,
        quantity: 1,
        totalPrice: productData.price * 1,
        discount: 0,
        totalAfterDiscount: +productData.price
      });
    }

    // fees calculations
    this.feesCalculation()

    // close and reset form
    document.getElementById('addItem').click();
    this.productForm.reset();
  }

  feesCalculation() {
    this.totalPrice = calculateSumByKey<IProduct>(this.productsList, 'totalPrice');
    this.totalDiscount = calculateSumByKey<IProduct>(this.productsList, 'discount');
    this.totalPriceAfterDiscount = this.totalDiscount > 0 ? calculateSumByKey<IProduct>(this.productsList, 'totalAfterDiscount') : this.totalPrice;
    this.companyFees = this.calculateCompnayFees();
    this.shippingFees = this.calculateShippingFees();

    this.finalPrice = this.companyFees + this.shippingFees + (this.totalDiscount > 0 ? this.totalPriceAfterDiscount : this.totalPrice);
  }

  calculateShippingFees(): number {
    let count = 0;
    for (let i = 0; i < this.productsList.length; i++) {
      const element = this.productsList[i];
      if (element.weight < 1) {
        count += 0;
      } else if (element.weight >= 1 && element.weight <= 5) {
        count += (element.weight * 10);
      } else if (element.weight > 5) {
        count += (element.weight * 25);
      }
    }
    return +count.toFixed(2);
  }

  calculateCompnayFees(): number {
    let total = this.totalDiscount > 0 ? calculateSumByKey<IProduct>(this.productsList, 'totalAfterDiscount') : calculateSumByKey<IProduct>(this.productsList, 'totalPrice');
    let result = total * (8 / 100);
    return +result.toFixed(2);
  }

  changeQuantity(item: IProduct, type: 'PLUS' | 'MINUS') {
    if (item.quantity >= 0) {
      if (type == 'PLUS') {
        item.quantity += 1;
      } else {
        item.quantity -= 1;
      }
    } else {
      item.quantity = 1;
    }
    item.totalPrice = item.quantity * item.price;
    this.feesCalculation();
  }

  applyDiscount(item: IProduct, type: 'PLUS' | 'MINUS') {
    if (item.discount >= 0) {
      if (type == 'PLUS') {
        item.discount += 1;
      } else {
        item.discount -= 1;
      }
    } else {
      item.discount = 0;
    }
    item.totalAfterDiscount = item.totalPrice - item.discount;
    this.feesCalculation();
  }

  applyCoupon(coupon: string) {
    if (coupon) {
      if (coupon.startsWith('SHP')) {
        this.shippingFees = this.shippingFees * (90 / 100);
        this.feesCalculation();
      } else if (coupon.startsWith('CS')) {
        this.finalPrice = this.finalPrice * (80 / 100);
      }
    }
  }

  editProduct(item: IProduct) {
    if (item && item.id) {
      this.productForm.patchValue(item);
      document.getElementById('openModal').click();
    }
  }

  deleteProduct(item: IProduct) {
    if (confirm('Are you sure to delete ' + item.name)) {
      let indx = this.productsList.indexOf(item);
      this.productsList.splice(indx, 1);
      this.feesCalculation();
    }
  }

}
