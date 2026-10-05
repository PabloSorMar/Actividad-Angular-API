import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  CurrencyPipe
} from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';
import {
  Product,
  ProductsResponse
} from '../../models/product.model';
import {
  ProductService
} from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  total = 0;
  loading = false;
  error = '';

  limit = 10;
  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadProducts(1);
  }

  loadProducts(page: number = this.currentPage): void {
    this.loading = true;
    this.error = '';
    this.currentPage = page;
    const skip = (page - 1) * this.limit;
    this.cdr.markForCheck();

    this.productService.getProducts(this.limit, skip)
      .subscribe({
        next: (response: ProductsResponse) => {
          this.products = response.products;
          this.total = response.total;
          this.totalPages = Math.ceil(this.total / this.limit) || 1;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(error);
          this.error = 'No se han podido cargar los productos.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages && !this.loading) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1 && !this.loading) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && !this.loading) {
      this.loadProducts(page);
    }
  }

  onLimitChange(newLimit: number): void {
    this.limit = Number(newLimit);
    this.loadProducts(1);
  }

  getStockValorado(product: Product): number {
    const stock = product.stock || 0;
    const price = product.price || 0;
    const discountPercentage = product.discountPercentage || 0;
    const subtotal = stock * price;
    const descuento = (subtotal * discountPercentage) / 100;
    return subtotal - descuento;
  }
}
