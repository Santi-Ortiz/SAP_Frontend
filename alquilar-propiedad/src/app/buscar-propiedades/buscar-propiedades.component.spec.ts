import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPropiedadesComponent } from './buscar-propiedades.component';

describe('BuscarPropiedadesComponent', () => {
  let component: BuscarPropiedadesComponent;
  let fixture: ComponentFixture<BuscarPropiedadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarPropiedadesComponent]
    });
    fixture = TestBed.createComponent(BuscarPropiedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
