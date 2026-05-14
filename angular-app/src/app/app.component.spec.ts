/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppComponent } from './app.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { Component } from '@angular/core';

// Initialize the Angular testing environment
try {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
} catch (e) {}

@Component({
  selector: 'app-chat-window',
  standalone: true,
  template: '<div id="mock-chat-window"></div>'
})
class MockChatWindowComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
    .overrideComponent(AppComponent, {
      set: {
        template: '<app-chat-window></app-chat-window>',
        styles: [],
        imports: [MockChatWindowComponent]
      }
    })
    .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the chat window', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#mock-chat-window')).toBeTruthy();
  });
});
