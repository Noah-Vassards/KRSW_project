import { IsStrong } from "./isStrong.pipe"

describe('is Strong pipe', () => {
    let isStrong: IsStrong;

    beforeEach(() => {
        isStrong = new IsStrong();
    })

    it('should be defined', () => {
        expect(isStrong).toBeDefined();
    })

    describe('validate', () => {
        it('should validate - 2 characters', async () => {
            const value = 'a1';

            const result = await isStrong.validate(value)

            expect(result).toBeTruthy();
        })

        it('should validate - 2 letters, 1 digit', async () => {
            const value = 'ab1';

            const result = await isStrong.validate(value)

            expect(result).toBeTruthy();
        })

        it('should validate - 1 letters, 2 digit', async () => {
            const value = 'a12';

            const result = await isStrong.validate(value)

            expect(result).toBeTruthy();
        })

        it('should validate - 10 characters', async () => {
            const value = 'skjY671hjd';

            const result = await isStrong.validate(value)

            expect(result).toBeTruthy();
        })

        it('should validate - special characters', async () => {
            const value = 'skjY671hjd&é\"\'(-è_çà)=+°}]@^\\`|[{#~^$*ù!:;,?./§%¨£µ';

            const result = await isStrong.validate(value)

            expect(result).toBeTruthy();
        })

        it('should not validate - no digit', async () => {
            const value = 'skjYhjd';

            const result = await isStrong.validate(value)

            expect(result).toBeFalsy();
        })

        it('should not validate - no letters', async () => {
            const value = '17282';

            const result = await isStrong.validate(value)

            expect(result).toBeFalsy();
        })
    })

    describe('default message', () => {
        it('should be default message', () => {
            expect(isStrong.defaultMessage()).toBe('password is not strong enough')
        })
    })
})