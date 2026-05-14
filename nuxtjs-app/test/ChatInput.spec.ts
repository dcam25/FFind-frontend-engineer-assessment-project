import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ChatInput from '../components/ChatInput.vue';

describe('ChatInput', () => {
  it('should clear input after submit', async () => {
    const wrapper = mount(ChatInput, {
      props: {
        disabled: false
      }
    });
    
    const textarea = wrapper.find('textarea');
    await textarea.setValue('Hello AI');
    
    const form = wrapper.find('form');
    await form.trigger('submit');
    
    expect(wrapper.emitted()).toHaveProperty('send');
    expect(textarea.element.value).toBe('');
  });

  it('should not emit if empty', async () => {
    const wrapper = mount(ChatInput, {
      props: {
        disabled: false
      }
    });
    
    const form = wrapper.find('form');
    await form.trigger('submit');
    
    expect(wrapper.emitted()).not.toHaveProperty('send');
  });
});
