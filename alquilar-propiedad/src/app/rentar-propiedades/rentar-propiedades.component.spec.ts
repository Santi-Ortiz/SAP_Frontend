import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentarPropiedadesComponent } from './rentar-propiedades.component';

describe('RentarPropiedadesComponent', () => {
  let component: RentarPropiedadesComponent;
  let fixture: ComponentFixture<RentarPropiedadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentarPropiedadesComponent]
    });
    fixture = TestBed.createComponent(RentarPropiedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
