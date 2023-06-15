import { Extra, Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const location: Middleware<Context> = async ctx => {
	const message = ctx.message?.reply_to_message
	const location = ctx.message?.text.split(/\s+/g).slice(1).join(' ') || ''

	if (!message || !('voice' in message)) {
		return
	}

	try {
		const audio = await Audio.findOneByOrFail({
			fileUid: message.voice.file_unique_id
		})
		const oldLocation = audio.location

		audio.location = location
		await audio.save()

		ctx.reply(ctx.t.commands.location.res.ok
			.replace('{old_location}', oldLocation || '')
			.replace('{location}', location || ''))

		logger.info(`set location of ${audio.fileUid} to ${location}`, 'command.location')
	}
	catch (err) {
		logger.error(err as string, 'command.actor')
		ctx.reply(ctx.t.commands.location.res.not_found, Extra.HTML())
	}
}
