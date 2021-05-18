import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { StatisticsResponse } from '../../../../model/statistics'
import { BackendService } from './backend.service'
import {
    HttpTestingController,
    HttpClientTestingModule,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { environment } from '../../environments/environment'
import { MyHttpInterceptor } from '../my-interceptor.interceptor'
import { NotificationsService } from './notifications.service'

describe('BackendService', () => {
    let httpController: HttpTestingController
    let backendService: BackendService
    let notificationsService: NotificationsService

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                BackendService,
                NotificationsService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MyHttpInterceptor,
                    multi: true,
                },
            ],
            imports: [HttpClientTestingModule],
        })

        httpController = TestBed.inject(HttpTestingController)
        backendService = TestBed.inject(BackendService)
        notificationsService = TestBed.inject(NotificationsService)

        expect(httpController).toBeTruthy()
        expect(backendService).toBeTruthy()
        expect(notificationsService).toBeTruthy()
    })

    afterEach(() => {
        httpController.verify()
    })

    it('should return expected statistics', async () => {
        const expected: StatisticsResponse = {
            errors: [],
            get: '',
            parameters: [],
            response: [
                {
                    continent: 'Europe',
                    country: 'Luxembourg',
                    population: 634861,
                    cases: {
                        new: '+37',
                        active: 2074,
                        critical: 30,
                        recovered: 66183,
                        '1M_pop': '108788',
                        total: 69065,
                    },
                    deaths: {
                        new: '+2',
                        '1M_pop': '1273',
                        total: 808,
                    },
                    tests: {
                        '1M_pop': '4349308',
                        total: 2761206,
                    },
                    day: '2021-05-18',
                    time: '2021-05-18T15:30:04+00:00',
                },
                {
                    continent: 'Europe',
                    country: 'Netherlands',
                    population: 17168090,
                    cases: {
                        new: '+5326',
                        active: 202469,
                        critical: 649,
                        recovered: 1386377,
                        '1M_pop': '93564',
                        total: 1606319,
                    },
                    deaths: {
                        new: '+17',
                        '1M_pop': '1018',
                        total: 17473,
                    },
                    tests: {
                        '1M_pop': '787781',
                        total: 13524699,
                    },
                    day: '2021-05-18',
                    time: '2021-05-18T15:30:03+00:00',
                },
            ],
        }

        // first request (nothing really interesting happens)
        backendService.getStatistics().subscribe({
            next: (data) => expect(data).toEqual(expected.response),
        })

        // again, nothing happens, let’s just give it what the service expects
        const reqOne = httpController.expectOne(
            environment.API_URL + 'statistics'
        )
        expect(reqOne.request.method).toEqual('GET')
        reqOne.flush(expected)

        // second request (testing if caching works)
        backendService.getStatistics().subscribe({
            next: (data) => expect(data).toEqual(expected.response),
        })

        // we’re expecting no request to the API, since the previous response should have been cached
        httpController.expectNone(environment.API_URL + 'statistics')
    })

    it('the HTTP interceptor should inform the user that there was an error', async () => {
        let times = 0

        // expect the notifications service to be informed about the error
        notificationsService.httpError.subscribe({
            next: (status) => {
                // first status will be false (BehaviorSubject always emits its first value)
                if (times !== 0) {
                    // then, we’re expecting another value to be true
                    expect(status).toEqual(true)
                }
                times++
            },
        })

        backendService.getStatistics().subscribe({
            // this should not run
            next: () => expect(false).toEqual(true),
        })

        // expect a request for statistics
        const req = httpController.expectOne(environment.API_URL + 'statistics')
        expect(req.request.method).toEqual('GET')
        // simulate an error
        req.flush('error', { status: 404, statusText: 'error' })

        // we expect the notifications service to emit two values:
        // - first time — initial value (always false)
        // - second time — a network error occurred
        expect(times).toEqual(2)
    })
})
