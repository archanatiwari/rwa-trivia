import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { RouterStateUrl } from '../../../shared/model';
import { TagActions, ActionWithPayload } from '../actions';
import { TagService } from '../../services';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class TagEffects {

    // Load tags based on url
    @Effect()
    // handle location update
    loadRouteCategories$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')
            ))
        .pipe(
            switchMap(() =>
                this.svc.getTags()
                    .pipe(
                        map((tags: string[]) => this.tagActions.loadTagsSuccess(tags))
                    )));

    @Effect()
    getActiveGames$ = this.actions$
        .pipe(ofType(TagActions.LOAD_TOP_TAGS))
        .pipe(
            map((action: ActionWithPayload<any[]>) => action.payload),
            switchMap((payload: any) => this.svc.getTopTags()),
            map((tags: any[]) => this.tagActions.loadTopTagsSuccess(tags))
        );

    constructor(
        private actions$: Actions,
        private tagActions: TagActions,
        private svc: TagService
    ) { }
}

