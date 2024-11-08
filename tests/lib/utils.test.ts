//  tests/lib/utils.test.ts

import {
  cn,
  getInputTypeDisplay,
  getInputTypeIcon,
  getInputValidationRuleDisplay,
  getAvailableValidationRules,
  capitalize,
  generateUniqueId,
  storeJwtToken,
  isExpiredJwtToken,
  getJwtToken,
  removeJwtToken,
  getJwtTokenData,
  getUserRoles,
  hasRole,
  throwConfettis,
} from "@/lib/utils";

import { InputType, ValidationRuleType } from '@/types/FormEnums';

jest.mock('canvas-confetti');

import confetti from 'canvas-confetti';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional class names', () => {
      expect(cn('class1', false && 'class2')).toBe('class1');
    });
  });

  describe('getInputTypeDisplay', () => {
    it('should return the correct display name for each input type', () => {
      expect(getInputTypeDisplay(InputType.TEXT)).toBe('Text');
      expect(getInputTypeDisplay(InputType.NUMBER)).toBe('Number');
      expect(getInputTypeDisplay(InputType.DATE)).toBe('Date');
      expect(getInputTypeDisplay(InputType.MULTIPLE_CHOICE)).toBe('Multiple Choice');
      expect(getInputTypeDisplay(InputType.GEOLOCATION)).toBe('Geolocation');
    });

    it('should return "Unknown" for an undefined input type', () => {
      expect(getInputTypeDisplay('UNDEFINED_TYPE' as InputType)).toBe('Unknown');
    });
  });

  describe('getInputTypeIcon', () => {
    it('should return the correct icon for each input type', () => {
      expect(getInputTypeIcon(InputType.TEXT)).toBe('A');
      expect(getInputTypeIcon(InputType.NUMBER)).toBe('#');
      expect(getInputTypeIcon(InputType.DATE)).toBe('📅');
      expect(getInputTypeIcon(InputType.MULTIPLE_CHOICE)).toBe('🔘');
      expect(getInputTypeIcon(InputType.GEOLOCATION)).toBe('🌍');
    });

    it('should return "?" for an undefined input type', () => {
      expect(getInputTypeIcon('UNDEFINED_TYPE' as InputType)).toBe('?');
    });
  });

  describe('getInputValidationRuleDisplay', () => {
    it('should return the correct display name for each validation rule type', () => {
      expect(getInputValidationRuleDisplay(ValidationRuleType.IS_EMAIL)).toBe('Is an email input?');
      expect(getInputValidationRuleDisplay(ValidationRuleType.IS_RADIO)).toBe('Is a radio input?');
      expect(getInputValidationRuleDisplay(ValidationRuleType.IS_MULTIPLE_CHOICE)).toBe('Is a multiple choice input?');
      expect(getInputValidationRuleDisplay(ValidationRuleType.REGEX_MATCH)).toBe('Must match a regex');
      expect(getInputValidationRuleDisplay(ValidationRuleType.MAX_LENGTH)).toBe('Maximum input length');
      expect(getInputValidationRuleDisplay(ValidationRuleType.MIN_LENGTH)).toBe('Minimum input length');
    });

    it('should return "Unknown" for an undefined validation rule type', () => {
      expect(getInputValidationRuleDisplay('UNDEFINED_TYPE' as ValidationRuleType)).toBe('Unknown');
    });
  });

  describe('getAvailableValidationRules', () => {
    it('should return the correct validation rules for InputType.TEXT', () => {
      expect(getAvailableValidationRules(InputType.TEXT)).toEqual([
        ValidationRuleType.MIN_LENGTH,
        ValidationRuleType.MAX_LENGTH,
        ValidationRuleType.IS_EMAIL,
        ValidationRuleType.REGEX_MATCH,
      ]);
    });

    it('should return the correct validation rules for InputType.NUMBER', () => {
      expect(getAvailableValidationRules(InputType.NUMBER)).toEqual([
        ValidationRuleType.MIN_VALUE,
        ValidationRuleType.MAX_VALUE,
      ]);
    });

    it('should return the correct validation rules for InputType.MULTIPLE_CHOICE', () => {
      expect(getAvailableValidationRules(InputType.MULTIPLE_CHOICE)).toEqual([
        ValidationRuleType.IS_RADIO,
        ValidationRuleType.IS_MULTIPLE_CHOICE,
      ]);
    });

    it('should return an empty array for an undefined input type', () => {
      expect(getAvailableValidationRules('UNDEFINED_TYPE' as InputType)).toEqual([]);
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter of a non-empty string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle an empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should not alter a string that already starts with a capital letter', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('generateUniqueId', () => {
    it('should generate a unique ID each time', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('JWT Token Functions', () => {
    const validToken = 'header.payload.signature';
    const invalidToken = 'invalid.token';

    afterEach(() => {
      // Clear localStorage after each test
      localStorage.clear();
    });

    describe('storeJwtToken', () => {
      it('should store a valid JWT token and set expiration', () => {
        const result = storeJwtToken(validToken);
        expect(result).toBe(true);
        expect(localStorage.getItem('session')).toBe(validToken);
        expect(localStorage.getItem('session_expiration')).toBeDefined();
      });

      it('should not store an invalid JWT token', () => {
        const result = storeJwtToken(invalidToken);
        expect(result).toBe(false);
        expect(localStorage.getItem('session')).toBeNull();
        expect(localStorage.getItem('session_expiration')).toBeNull();
      });
    });

    describe('isExpiredJwtToken', () => {
      it('should return true if token is expired', () => {
        localStorage.setItem('session_expiration', (Date.now() - 1000).toString());
        expect(isExpiredJwtToken()).toBe(true);
      });

      it('should return false if token is not expired', () => {
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());
        expect(isExpiredJwtToken()).toBe(false);
      });

      it('should return true if no expiration is set', () => {
        expect(isExpiredJwtToken()).toBe(true);
      });
    });

    describe('getJwtToken', () => {
      it('should return null if token is expired', () => {
        localStorage.setItem('session_expiration', (Date.now() - 1000).toString());
        localStorage.setItem('session', validToken);
        expect(getJwtToken()).toBeNull();
      });

      it('should return the token if not expired', () => {
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());
        localStorage.setItem('session', validToken);
        expect(getJwtToken()).toBe(validToken);
      });
    });

    describe('removeJwtToken', () => {
      it('should remove token and expiration from localStorage', () => {
        localStorage.setItem('session', validToken);
        localStorage.setItem('session_expiration', '1234567890');
        removeJwtToken();
        expect(localStorage.getItem('session')).toBeNull();
        expect(localStorage.getItem('session_expiration')).toBeNull();
      });
    });

    describe('getJwtTokenData', () => {
      it('should return decoded JWT token data', () => {
        const payloadData = { user: 'testUser', role: 'ADMIN' };
        const payload = btoa(JSON.stringify(payloadData));
        const token = `header.${payload}.signature`;
        localStorage.setItem('session', token);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(getJwtTokenData()).toEqual(payloadData);
      });

      it('should return null if token is invalid', () => {
        localStorage.setItem('session', invalidToken);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(getJwtTokenData()).toBeNull();
      });
    });

    describe('getUserRoles', () => {
      it('should return an array of user roles', () => {
        const payloadData = { role: 'USER, ADMIN' };
        const payload = btoa(JSON.stringify(payloadData));
        const token = `header.${payload}.signature`;

        localStorage.setItem('session', token);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(getUserRoles()).toEqual(['USER', 'ADMIN']);
      });

      it('should return an array with default USER role if no other roles are present', () => {
        const payloadData = {};
        const payload = btoa(JSON.stringify(payloadData));
        const token = `header.${payload}.signature`;

        localStorage.setItem('session', token);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(getUserRoles()).toEqual(['USER']);
      });
    });

    describe('hasRole', () => {
      it('should return true if user has the specified role', () => {
        const payloadData = { role: 'USER, ADMIN' };
        const payload = btoa(JSON.stringify(payloadData));
        const token = `header.${payload}.signature`;

        localStorage.setItem('session', token);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(hasRole('ADMIN')).toBe(true);
      });

      it('should return true if user is ADMIN regardless of the role checked', () => {
        const payloadData = { role: 'ADMIN' };
        const payload = btoa(JSON.stringify(payloadData));
        const token = `header.${payload}.signature`;

        localStorage.setItem('session', token);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(hasRole('ANY_ROLE')).toBe(true);
      });

      it('should return false if user does not have the specified role', () => {
        const payloadData = { role: 'USER' };
        const payload = btoa(JSON.stringify(payloadData));
        const token = `header.${payload}.signature`;

        localStorage.setItem('session', token);
        localStorage.setItem('session_expiration', (Date.now() + 1000 * 60).toString());

        expect(hasRole('ADMIN')).toBe(false);
      });
    });
  });

  describe('throwConfettis', () => {
    it('should call confetti function multiple times', () => {
      throwConfettis();
      expect(confetti).toHaveBeenCalled();
    });
  });
});
