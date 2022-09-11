import {Component, OnInit, ViewChild} from '@angular/core';
import {OrderService} from "../../order.service";
import { Subscription} from "rxjs";
import {Order} from "../../models/order";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  userId: string;
  orders: MatTableDataSource<Order>;
  displayedColumns: string[] = ['name', 'datePlaced', 'action'];
  searchValue: string;
  subOrders: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService: OrderService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit() {
    this.subOrders = this.orderService.getOrders()
      .subscribe((orders) => {
        this.orders = new MatTableDataSource<any>(orders);
        this.orders.paginator = this.paginator;
        this.orders.sort = this.sort;
        this.orders.filterPredicate = function (record,filter) {
          return record.userId.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
        }
      });
  }

  applyFilter(event: KeyboardEvent) {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.orders.filter = this.searchValue;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
