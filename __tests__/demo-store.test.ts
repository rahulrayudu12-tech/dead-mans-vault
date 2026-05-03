import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useDemoStore } from '@/lib/demo-store'

// Create a mock provider for testing
function createMockProvider() {
  const { DemoProvider } = require('@/lib/demo-store')
  return DemoProvider
}

describe('Demo Store - Core Functions', () => {
  describe('Vault Operations', () => {
    it('should create a vault with files', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      act(() => {
        result.current.createVault('Test Vault', 'document', 'Inactivity > 30d', 'Test message', [
          { id: 'f1', name: 'test.pdf', size: 1024, type: 'application/pdf' },
        ])
      })

      expect(result.current.vaults.length).toBeGreaterThan(0)
      expect(result.current.vaults[0].name).toBe('Test Vault')
      expect(result.current.vaults[0].uploadedFiles.length).toBe(1)
    })

    it('should delete a vault', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const initialCount = result.current.vaults.length
      const vaultToDelete = result.current.vaults[0]

      act(() => {
        result.current.deleteVault(vaultToDelete.id)
      })

      expect(result.current.vaults.length).toBe(initialCount - 1)
      expect(result.current.vaults.find((v) => v.id === vaultToDelete.id)).toBeUndefined()
    })

    it('should update vault status', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const vault = result.current.vaults[0]

      act(() => {
        result.current.updateVaultStatus(vault.id, 'locked')
      })

      const updated = result.current.vaults.find((v) => v.id === vault.id)
      expect(updated?.status).toBe('locked')
    })
  })

  describe('Share Link Operations', () => {
    it('should create a share link with passcode', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const vault = result.current.vaults[0]
      const emails = ['test@example.com']

      let shareLink
      act(() => {
        shareLink = result.current.shareVault(vault.id, emails, 30)
      })

      expect(shareLink).toBeDefined()
      expect(shareLink.passcode).toMatch(/^VAULT-[A-Z0-9]{6}$/)
      expect(shareLink.authorizedEmails).toEqual(emails)
    })

    it('should validate share access with correct credentials', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const vault = result.current.vaults[0]
      const email = 'user@example.com'

      let shareLink
      act(() => {
        shareLink = result.current.shareVault(vault.id, [email], 30)
      })

      let accessResult
      act(() => {
        accessResult = result.current.validateShareAccess(vault.id, shareLink.id, shareLink.passcode, email)
      })

      expect(accessResult.success).toBe(true)
      expect(accessResult.vault?.id).toBe(vault.id)
    })

    it('should reject access with wrong passcode', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const vault = result.current.vaults[0]
      const email = 'user@example.com'

      let shareLink
      act(() => {
        shareLink = result.current.shareVault(vault.id, [email], 30)
      })

      let accessResult
      act(() => {
        accessResult = result.current.validateShareAccess(vault.id, shareLink.id, 'WRONG-PASSCODE', email)
      })

      expect(accessResult.success).toBe(false)
    })

    it('should reject access with unauthorized email', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const vault = result.current.vaults[0]

      let shareLink
      act(() => {
        shareLink = result.current.shareVault(vault.id, ['authorized@example.com'], 30)
      })

      let accessResult
      act(() => {
        accessResult = result.current.validateShareAccess(
          vault.id,
          shareLink.id,
          shareLink.passcode,
          'unauthorized@example.com'
        )
      })

      expect(accessResult.success).toBe(false)
    })
  })

  describe('Contact Operations', () => {
    it('should add contact with phone and photo', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const initialCount = result.current.contacts.length

      act(() => {
        result.current.addContact('John Doe', 'john@example.com', 'Executor', '+1234567890', 'https://example.com/photo.jpg')
      })

      expect(result.current.contacts.length).toBe(initialCount + 1)
      const newContact = result.current.contacts[result.current.contacts.length - 1]
      expect(newContact.phone).toBe('+1234567890')
      expect(newContact.photoUrl).toBe('https://example.com/photo.jpg')
    })

    it('should verify contact', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const contact = result.current.contacts.find((c) => !c.verified)

      if (contact) {
        act(() => {
          result.current.verifyContact(contact.id)
        })

        const updated = result.current.contacts.find((c) => c.id === contact.id)
        expect(updated?.verified).toBe(true)
        expect(updated?.shards).toBe(1)
      }
    })

    it('should update contact notification method', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const contact = result.current.contacts[0]

      act(() => {
        result.current.updateContactNotifyVia(contact.id, ['sms'])
      })

      const updated = result.current.contacts.find((c) => c.id === contact.id)
      expect(updated?.notifyVia).toEqual(['sms'])
    })
  })

  describe('Check-in Operations', () => {
    it('should record check-in and reset timer', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const oldCheckIn = result.current.lastCheckIn
      const oldCount = result.current.checkInCount

      act(() => {
        result.current.checkIn()
      })

      expect(result.current.lastCheckIn.getTime()).toBeGreaterThan(oldCheckIn.getTime())
      expect(result.current.checkInCount).toBe(oldCount + 1)
    })
  })

  describe('Auto-Release Configuration', () => {
    it('should set auto-release config', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const vault = result.current.vaults[0]
      const contact = result.current.contacts[0]

      act(() => {
        result.current.setAutoReleaseConfig({
          vaultId: vault.id,
          recipientContactIds: [contact.id],
          delayAfterTriggerHours: 24,
          requireConfirmation: false,
          notifyMethod: 'both',
        })
      })

      const config = result.current.autoReleaseConfigs.find((c) => c.vaultId === vault.id)
      expect(config).toBeDefined()
      expect(config?.recipientContactIds).toContain(contact.id)
      expect(config?.notifyMethod).toBe('both')
    })

    it('should simulate trigger and log auto-release', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const initialLogCount = result.current.logs.length

      act(() => {
        result.current.simulateTrigger()
      })

      expect(result.current.logs.length).toBeGreaterThan(initialLogCount)
      const triggeredLogs = result.current.logs.filter((l) => l.severity === 'alert')
      expect(triggeredLogs.length).toBeGreaterThan(0)
    })
  })

  describe('Integration Operations', () => {
    it('should connect external integration', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      act(() => {
        result.current.connectIntegration('notion', 'user@notion.com')
      })

      const integration = result.current.integrations.find((i) => i.type === 'notion')
      expect(integration?.connected).toBe(true)
      expect(integration?.accountEmail).toBe('user@notion.com')
      expect(integration?.checkForActivity).toBe(true)
    })

    it('should disconnect integration', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const integration = result.current.integrations.find((i) => i.connected)

      if (integration) {
        act(() => {
          result.current.disconnectIntegration(integration.id)
        })

        const updated = result.current.integrations.find((i) => i.id === integration.id)
        expect(updated?.connected).toBe(false)
        expect(updated?.checkForActivity).toBe(false)
      }
    })
  })

  describe('Audit Logging', () => {
    it('should log all vault operations', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const initialCount = result.current.logs.length

      act(() => {
        result.current.createVault('Audit Test', 'secret', 'Inactivity > 30d')
      })

      expect(result.current.logs.length).toBeGreaterThan(initialCount)
      const latestLog = result.current.logs[result.current.logs.length - 1]
      expect(latestLog.action).toContain('Audit Test')
    })

    it('should include timestamps in logs', () => {
      const { result } = renderHook(() => useDemoStore(), {
        wrapper: createMockProvider(),
      })

      const log = result.current.logs[result.current.logs.length - 1]
      expect(log.time).toBeInstanceOf(Date)
    })
  })
})
