import {Injectable} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Injectable()
export class RoutingStateService {
  private history: Array<string> = [];

  constructor(
    private router: Router,
  ) {}

  recordHistory() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((data) => {
        this.history = [...this.history, (data as NavigationEnd).urlAfterRedirects];
      });
  }

  getHistory(): string[] {
    return this.history;
  }

  getPreviousUrl(): string {
    return this.history[this.history.length - 2] || this.router.url;
  }

  getCurrentUrl() {
    return this.router.url
  }
}
