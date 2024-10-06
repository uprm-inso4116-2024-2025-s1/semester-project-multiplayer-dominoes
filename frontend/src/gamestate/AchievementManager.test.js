import AchievementManager from './AchievementManager.js';
import { toast } from 'react-toastify';

// Mock toast function to avoid real calls during testing
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('AchievementManager', () => {
  let achievementManager;

  beforeEach(() => {
    achievementManager = new AchievementManager();
  });

  test('should unlock "startWithDoubleSix" when starting with double six', () => {
    const initialHand = [[6, 6], [2, 5], [3, 4]];
    achievementManager.checkStartWithDoubleSix(initialHand);
    
    expect(achievementManager.getAchievements().startWithDoubleSix).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Achievement Unlocked: Started with Double Six!", expect.anything());
  });

  test('should not unlock "startWithDoubleSix" if hand does not contain double six', () => {
    const initialHand = [[2, 5], [3, 4], [1, 2]];
    achievementManager.checkStartWithDoubleSix(initialHand);
    
    expect(achievementManager.getAchievements().startWithDoubleSix).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
  });

  test('should unlock "winGame" and "winWithoutDrawing" when player wins without drawing', () => {
    const playerHand = [];
    achievementManager.checkWin(playerHand);

    expect(achievementManager.getAchievements().winGame).toBe(true);
    expect(achievementManager.getAchievements().winWithoutDrawing).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Achievement Unlocked: Won the Game!", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Achievement Unlocked: Won Without Drawing!", expect.anything());
  });

  test('should only unlock "winGame" when player wins after drawing', () => {
    const playerHand = [];
    achievementManager.trackDrawing();  // Player draws a domino
    achievementManager.checkWin(playerHand);

    expect(achievementManager.getAchievements().winGame).toBe(true);
    expect(achievementManager.getAchievements().winWithoutDrawing).toBe(false);  // Should not unlock "winWithoutDrawing"
    expect(toast.success).toHaveBeenCalledWith("Achievement Unlocked: Won the Game!", expect.anything());
  });

  test('should unlock "allDoublesHand" when all dominos in the hand are doubles', () => {
    const initialHand = [[1, 1], [2, 2], [3, 3]];
    achievementManager.checkAllDoublesHand(initialHand);

    expect(achievementManager.getAchievements().allDoublesHand).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Achievement Unlocked: All Doubles Hand!", expect.anything());
  });

  test('should not unlock "allDoublesHand" when hand does not contain all doubles', () => {
    const initialHand = [[1, 1], [2, 3], [4, 4]];
    achievementManager.checkAllDoublesHand(initialHand);

    expect(achievementManager.getAchievements().allDoublesHand).toBe(false);
    expect(toast.success).not.toHaveBeenCalled();
  });
});