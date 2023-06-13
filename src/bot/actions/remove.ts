import { Middleware } from 'telegraf'

import { Context } from '../../types'
import { logger } from '../../utils'
import { Audio } from '../../models'

export const remove: Middleware<Context> = async ctx => {
	const fileUid = ctx.match && ctx.match[1]
	if (!fileUid) {
		return
	}

	try {
		await Audio.delete({ fileUid: fileUid })
		ctx.editMessageText(ctx.t.actions.remove.res.ok)
	}
	catch (err) {
		ctx.answerCbQuery(ctx.t.common.res.fail, true)
		logger.error(''+err, 'action.remove')
	}
}
