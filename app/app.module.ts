import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NSFRESCO_DIRECTIVES } from 'nativescript-fresco/angular';
import { AppComponent } from "./app.component";
import { LISTVIEW_DIRECTIVES } from 'nativescript-telerik-ui/listview/angular';

@NgModule({
    declarations: [AppComponent,LISTVIEW_DIRECTIVES,NSFRESCO_DIRECTIVES],
    bootstrap: [AppComponent],
    imports: [NativeScriptModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
